//All imports
const express = require( 'express' );
const multer = require( 'multer' );
const path = require( 'path' );
const mongoose = require( 'mongoose' );
const morgan = require( 'morgan' );
const bodyParser = require( 'body-parser' );
const bcrypt = require ( 'bcryptjs' );
const jsonwebtoken = require( 'jsonwebtoken' );

//Set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function( req, file, cb){
        cb( null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

//Init upload
const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb){
        checkSubmissionAndUser(file, cb);
    }
}).single('image_Upload');

function checkSubmissionAndUser( file, cb){
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    }
    else{
        cb('Error: images only!');
    }
}

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


//                                      USER ENDPOINTS
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

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

//Get user by _id
app.get( '/api/get-userby_id', jsonParser, ( req, res ) => {

    let id = req.query._id;

    if( !id){
        res.statusMessage = "Parameter missing in the body of the request.";
        return res.status( 406 ).end();
    }

    Users
        .getUserByID( id )
        .then( result => {

            if (result.length == 0){
                res.statusMessage = `No Users with the id = ${id} were found on the list.`;
                return res.status ( 404 ).end();
            }

            //Return status text and user parsed as a json object.
            return res.status( 200 ).json( result );
        })
        .catch( err => {
            console.log(err)
            res.statusMessage = "Something is wrong with the database, try again later.";
            //500 es el típico para cuando el server está abajo.
            return res.status( 500 ).end();
        });
});

//Get user by email
app.get( '/api/get-user', jsonParser, ( req, res ) => {

    let { email } = req.body;

    if( !email){
        res.statusMessage = "Parameter missing in the body of the request.";
        return res.status( 406 ).end();
    }

    Users
        .getUserByEmail( email )
        .then( result => {

            if (result.length == 0){
                res.statusMessage = `No Users with the email = ${email} were found on the list.`;
                return res.status ( 404 ).end();
            }

            //Return status text and user parsed as a json object.
            return res.status( 200 ).json( result );
        })
        .catch( err => {
            res.statusMessage = "Something is wrong with the database, try again later.";
            //500 es el típico para cuando el server está abajo.
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
        console.log(decoded)
        return res.status( 200 ).json( decoded );
    });
});

//                                    ARTWORK ENDPOINTS
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

//Get all artworks
app.get('/api/artworks', (req, res) => {
    console.log("Getting the list of all artworks" );

    Artworks
        .getAllArtworks()
        .then( result => {
            return res.status( 200 ).json( result );
        })
        .catch( err => {
            res.statusMessage = "Something is wrong with the database, try again later.";
            return res.status( 500 ).end();
        });

});


//Create artwork endpoint
app.post( '/api/create-artwork', jsonParser, ( req, res ) => {

    //Upload image file
    upload( req, res, ( err ) => {
        if( err ){
            res.statusMessage = `There was a problem with uploading the image`;
            return res.status ( 404 ).end();
        } else {
            //console.log(req)
            name = req.body.artworkName_Upload
            description = req.body.description_Upload
            user_id = req.body.user_id
            sessiontoken = req.body.user_token
            localPath = req.file.path

            jsonwebtoken.verify( sessiontoken, SECRET_TOKEN, ( err, decoded ) => {
            if( err ){
                res.statusMessage = "Session expired!";
                return res.status( 400 ).end();
            }
            

            // Continue with the posting of the artwork
        


            // Validations go here
            if( !name || !description){
                res.statusMessage = "Parameter missing in the body of the request.";
                return res.status( 406 ).end();
            }
            

            Users
                .getUserByID( user_id )
                .then( user => {

                    if( !user ){
                        res.statusMessage = `No Users with the email = ${decoded.email} were found on the list.`;
                        return res.status ( 404 ).end();
                    }
                    localPath = localPath.replace(/\\/g, "/");
                    localPath = localPath.replace(/public/g, "");

                    const newArtwork = {
                        name,
                        author : user._id,
                        description,
                        path : localPath
                    }
                    
                    Artworks
                        .addArtwork( newArtwork )
                        .then( artwork => {
                            return res.status( 201 ).json( artwork );
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
        }
    });


    
    
})


//Get artworks by authorid
app.get( '/api/get-artworksbyid', jsonParser, ( req, res ) => {

    let _id = req.query._id;

    if( !_id){
        res.statusMessage = "Parameter missing in the body of the request.";
        return res.status( 406 ).end();
    }

    Artworks
        .getArtworksByAuthorId( _id )
        .then( result => {

            //Hide this validation because if there's 0 artworks for this user we still want this endpoint to return succesfull, as we'll display 0 artworks.
            /*if (result.length == 0){
                res.statusMessage = `No artworks with the author = ${_id} were found on the list.`;
                return res.status ( 404 ).end();
            }*/

            //Return status text and user parsed as a json object.
            return res.status( 200 ).json( result );
        })
        .catch( err => {
            (console.log(err))
            res.statusMessage = "Something is wrong with the database, try again later.";
            //500 es el típico para cuando el server está abajo.
            return res.status( 500 ).end();
        });
});

//Get artworks by artwork _id
app.get( '/api/get-artworkbyid', jsonParser, ( req, res ) => {

    let _id = req.query._id;

    if( !_id){
        res.statusMessage = "Parameter missing in the body of the request.";
        return res.status( 406 ).end();
    }

    Artworks
        .getArtworksByID( _id )
        .then( result => {

            if (result.length == 0){
                res.statusMessage = `No artworks with the author = ${_id} were found on the list.`;
                return res.status ( 404 ).end();
            }

            //Return status text and user parsed as a json object.
            return res.status( 200 ).json( result );
        })
        .catch( err => {
            console.log(err)
            res.statusMessage = "Something is wrong with the database, try again later.";
            //500 es el típico para cuando el server está abajo.
            return res.status( 500 ).end();
        });
});

//Delete artwork by artworkid
app.delete( '/api/delete-artworkbyid', jsonParser, ( req, res ) => {

    let _id = req.query._id;

    if( !_id){
        res.statusMessage = "Parameter missing in the body of the request.";
        return res.status( 406 ).end();
    }

    Artworks
        .removeArtworkbyID( _id )
        .then( result => {

            if (result.length == 0){
                res.statusMessage = `No artworks with the author = ${_id} were found on the list.`;
                return res.status ( 404 ).end();
            }

            //Return status text and user parsed as a json object.
            return res.status( 200 ).json( result );
        })
        .catch( err => {
            res.statusMessage = "Something is wrong with the database, try again later.";
            //500 es el típico para cuando el server está abajo.
            return res.status( 500 ).end();
        });
});

//                                    COMMENT ENDPOINTS
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

//Get all comments
app.get('/api/comments', (req, res) => {
    console.log("Getting the list of all comments" );

    Comments
        .getAllComments()
        .then( result => {
            return res.status( 200 ).json( result );
        })
        .catch( err => {
            res.statusMessage = "Something is wrong with the database, try again later.";
            return res.status( 500 ).end();
        });

});

//Get comments by artworkid
app.get( '/api/get-commentsbyArtwork', jsonParser, ( req, res ) => {

    let _id = req.query._id;

    if( !_id){
        res.statusMessage = "Parameter missing in the body of the request.";
        return res.status( 406 ).end();
    }

    Comments
        .getCommentsByArtworkId( _id )
        .then( result => {

            if (result.length == 0){
                res.statusMessage = `No comments with the artwork = ${_id} were found on the list.`;
                return res.status ( 404 ).end();
            }

            //Return status text and user parsed as a json object.
            return res.status( 200 ).json( result );
        })
        .catch( err => {
            res.statusMessage = "Something is wrong with the database, try again later.";
            //500 es el típico para cuando el server está abajo.
            return res.status( 500 ).end();
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
       const { content, artwork_id } = req.body;

        // Validations go here
        if( !content || !artwork_id){
            res.statusMessage = "Parameter missing in the body of the request.";
            return res.status( 406 ).end();
        }

        Users
            .getUserByEmail( decoded.email )
            .then( user => {

                if( !user ){
                    res.statusMessage = `No Users with the email = ${decoded.email} were found on the list.`;
                    return res.status ( 404 ).end();
                }

                const newComment = {
                    content,
                    author : user._id,
                    artwork : artwork_id
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


//                                 LOGIN AND SIGNUP ENDPOINTS
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

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
                                email : user.email,
                                description : user.description,
                                follows : user.follows,
                                followers : user.followers,
                                favorites : user.favorites,
                                likes : user.likes,
                                _id : user._id
                            };

                            jsonwebtoken.sign( userData, SECRET_TOKEN, { expiresIn : '15m' }, ( err, token ) => {
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
                throw new Error( "User doesn't exist!" );
            }
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});


//Create a user endpoint
app.post( '/api/users/register', jsonParser, ( req, res ) => {
    let {username, email, password, description} = req.body;

    if( !username || !email || !password || !description){
        res.statusMessage = "Parameter missing in the body of the request.";
        return res.status( 406 ).end();
    }
    
    bcrypt.hash( password, 10 )
        .then( hashedPassword => {
            let newUser = { 
                username, 
                password : hashedPassword, 
                email,
                description
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

//                                 FOLLOW ENDPOINTS
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

app.patch( '/api/users/updatefollow', jsonParser, ( req, res ) =>{
    const { sessiontoken } = req.headers;

    jsonwebtoken.verify( sessiontoken, SECRET_TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }

        //If modify is 1, we add the user, if its -1, we delete the user from the follows
        let { user_id, followUser, modify} = req.body;

        if( !user_id || !followUser || !modify ){
            res.statusMessage = "Parameter missing in the body of the request.";
            return res.status( 406 ).end();
        }

        Users
        .getUserByID( user_id )
        .then( result => {

            if (result.length == 0){
                res.statusMessage = `No Users with the id = ${id} were found on the list.`;
                return res.status ( 404 ).end();
            }

            if(modify === 1){
                newFollows = result.follows;
                newFollows.push(followUser);
            }
            else{
                var newFollows =  result.follows.filter(function(follow) {
                    return follow != followUser;
                });
            }

            Users
                .updateFollowUser( user_id , newFollows )
                .then( result => {

                    if ( result.n == 0 ){
                        console.log(result)
                        res.statusMessage = "The user was not modified";
                        return res.status( 404 ).end()
                    }
                    else{
                        
                        return res.status( 202 ).json( result );
                    }
                })
                .catch( err => {
                    res.statusMessage = "Something is wrong with the database, try again later.";
                    return res.status( 500 ).end();
                });
        })
        .catch( err => {

            console.log(err)
            res.statusMessage = "Something is wrong with the database, try again later.";
            //500 es el típico para cuando el server está abajo.
            return res.status( 500 ).end();
        });
    });
})

//                                 LIKE ENDPOINTS
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

app.patch( '/api/users/updatelike', jsonParser, ( req, res ) =>{
    const { sessiontoken } = req.headers;

    jsonwebtoken.verify( sessiontoken, SECRET_TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }

        //If modify is 1, we add the artwork, if its -1, we delete the artwork from the likes
        let { user_id, artwork_id, modify} = req.body;

        if( !user_id || !artwork_id || !modify ){
            res.statusMessage = "Parameter missing in the body of the request.";
            return res.status( 406 ).end();
        }

        Users
        .getUserByID( user_id )
        .then( result => {

            if (result.length == 0){
                res.statusMessage = `No Users with the id = ${id} were found on the list.`;
                return res.status ( 404 ).end();
            }

            if(modify === 1){
                newLikes = result.likes;
                newLikes.push(artwork_id);
            }
            else{
                var newLikes =  result.likes.filter(function(like) {
                    return like != artwork_id;
                });
            }

            Users
                .updateLikeUser( user_id , newLikes )
                .then( result => {

                    if ( result.n == 0 ){
                        console.log(result)
                        res.statusMessage = "The user was not modified";
                        return res.status( 404 ).end()
                    }
                    else{
                        
                        return res.status( 202 ).json( result );
                    }
                })
                .catch( err => {
                    res.statusMessage = "Something is wrong with the database, try again later.";
                    return res.status( 500 ).end();
                });
        })
        .catch( err => {

            console.log(err)
            res.statusMessage = "Something is wrong with the database, try again later.";
            //500 es el típico para cuando el server está abajo.
            return res.status( 500 ).end();
        });
    });
})

//                                 FAVORITE ENDPOINTS
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

app.patch( '/api/users/updatefavorite', jsonParser, ( req, res ) =>{
    const { sessiontoken } = req.headers;

    jsonwebtoken.verify( sessiontoken, SECRET_TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }

        //If modify is 1, we add the artwork, if its -1, we delete the artwork from the likes
        let { user_id, artwork_id, modify} = req.body;

        if( !user_id || !artwork_id || !modify ){
            res.statusMessage = "Parameter missing in the body of the request.";
            return res.status( 406 ).end();
        }

        Users
        .getUserByID( user_id )
        .then( result => {

            if (result.length == 0){
                res.statusMessage = `No Users with the id = ${id} were found on the list.`;
                return res.status ( 404 ).end();
            }

            if(modify === 1){
                newFavs = result.favorites;
                newFavs.push(artwork_id);
            }
            else{
                var newFavs =  result.favorites.filter(function(fav) {
                    return fav != artwork_id;
                });
            }

            Users
                .updateFavUser( user_id , newFavs )
                .then( result => {

                    if ( result.n == 0 ){
                        console.log(result)
                        res.statusMessage = "The user was not modified";
                        return res.status( 404 ).end()
                    }
                    else{
                        
                        return res.status( 202 ).json( result );
                    }
                })
                .catch( err => {
                    res.statusMessage = "Something is wrong with the database, try again later.";
                    return res.status( 500 ).end();
                });
        })
        .catch( err => {

            console.log(err)
            res.statusMessage = "Something is wrong with the database, try again later.";
            //500 es el típico para cuando el server está abajo.
            return res.status( 500 ).end();
        });
    });
})



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