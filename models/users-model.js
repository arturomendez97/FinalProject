const mongoose = require( 'mongoose' );

const userSchema = mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required: true
    },
    description : {
        type : String,
        required : true
    },
    follows: [{
        type: String
    }],
    followers: [{
        type: String
    }],
    favorites: [{
        type: String
    }],
    likes: [{
        type: String
    }]

});

const userModel = mongoose.model( 'users', userSchema );

const Users = {
    getAllUsers : function(){
        return userModel
                .find()
                .then( users => {
                    return users;
                })
                .catch( err => {
                    return err;
                });
    },
    createUser : function( newUser ){
        return userModel
                .create( newUser )
                .then( user => {
                    return user;
                })
                .catch( err => {
                    throw new Error( err.message );
                }); 
    },
    getUserByEmail: function( email ){
        return userModel
                .findOne( { email } )
                .then( user => {
                    return user;
                })
                .catch( err => {
                    throw new Error( err.message );
                }); 
    }
}

module.exports = {
    Users
};