//All imports
const express = require( 'express' );
const mongoose = require( 'mongoose' );
const morgan = require( 'morgan' );
const bodyParser = require( 'body-parser' );
const bcrypt = require ( 'bcryptjs' );
const jsonwebtoken = require( 'jsonwebtoken' );

//Config file import
const { DATABASE_URL, PORT, SECRET_TOKEN } = require( './config' );

//Model imports
const { Users } = require( './models/users-model' );
const { Comments } = require( './models/comments-model' );
const { Artworks } = require( './models/artworks-model')

const app = express();
const jsonParser = bodyParser.json();
const cors = require( './middleware/cors' );

app.use( cors );
app.use( express.static( "public" ) );
app.use( morgan( 'dev' ) );

//Get all users
app.get('/api/users', (req, res) => {
    console.log("Getting the list of all users" );

    Users
        .getAllUsers()
        .then( result => {
            return res.status( 200 ).json( result );
        })
        .catch( err => {
            res.statusMessage = "Something is wrong with the database, try again later.";
            return res.status( 500 ).end();
        });

});


//Validate user endpoint, maybe make it a middleware.
app.get( '/api/validate-user', ( req, res ) => {
    const { sessiontoken } = req.headers;

    jsonwebtoken.verify( sessiontoken, SECRET_TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }

        return res.status( 200 ).json( decoded );
    });
});

//Create comment endpoint
app.post( '/api/create-comment', jsonParser, ( req, res ) => {
    
    const { sessiontoken } = req.headers;
    jsonwebtoken.verify( sessiontoken, SECRET_TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }

       // Continue with the posting of the comment
       const { content } = req.body;

        // Validations go here

        Users
            .getUserByEmail( decoded.email )
            .then( user => {

                if( !user ){
                    // Validation needed here
                }

                const newComment = {
                    content,
                    author : user._id
                }
                
                Comments
                    .addComment( newComment )
                    .then( comment => {
                        return res.status( 201 ).json( comment );
                    })
                    .catch( err => {
                        res.statusMessage = err.message;
                        return res.status( 400 ).end();
                    });
            })
            .catch( err => {
                res.statusMessage = err.message;
                return res.status( 400 ).end();
            });
        });
})

//Login endpoint
app.post( '/api/users/login', jsonParser, ( req, res ) => {
    let { email, password } = req.body;

    if( !email || !password ){
        res.statusMessage = "Parameter missing in the body of the request.";
        return res.status( 406 ).end();
    }

    Users
        .getUserByEmail( email )
        .then( user => {

            if( user ){
                bcrypt.compare( password, user.password )
                    .then( result => {
                        if( result ){
                            let userData = {
                                username : user.username,
                                email : user.email
                            };

                            jsonwebtoken.sign( userData, SECRET_TOKEN, { expiresIn : '5m' }, ( err, token ) => {
                                if( err ){
                                    res.statusMessage = "Something went wrong with generating the token.";
                                    return res.status( 400 ).end();
                                }
                                return res.status( 200 ).json( { token } );
                            });
                        }
                        else{
                            throw new Error( "Invalid credentials" );
                        }
                    })
                    .catch( err => {
                        res.statusMessage = err.message;
                        return res.status( 400 ).end();
                    });
            }
            else{
                throw new Error( "User doesn't exists!" );
            }
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});

//Create a user endpoint
app.post( '/api/users/register', jsonParser, ( req, res ) => {
    let {username, email, password} = req.body;

    if( !username || !email || !password ){
        res.statusMessage = "Parameter missing in the body of the request.";
        return res.status( 406 ).end();
    }
    
    bcrypt.hash( password, 10 )
        .then( hashedPassword => {
            let newUser = { 
                username, 
                password : hashedPassword, 
                email 
            };

            Users
                .createUser( newUser )
                .then( result => {
                    return res.status( 201 ).json( result ); 
                })
                .catch( err => {
                    res.statusMessage = err.message;
                    return res.status( 400 ).end();
                });
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});

app.listen( PORT, () =>{
    console.log( "This server is running on port 8080" );

    new Promise( ( resolve, reject ) => {

        const settings = {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true
        };
        mongoose.connect( DATABASE_URL, settings, ( err ) => {
            if( err ){
                return reject( err );
            }
            else{
                console.log( "Database connected successfully." );
                return resolve();
            }
        })
    })
    .catch( err => {
        console.log( err );
    });
});