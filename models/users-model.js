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
    },
    getUserByID: function( _id ){
        return userModel
                .findOne( { _id } )
                .then( user => {
                    return user;
                })
                .catch( err => {
                    throw new Error( err.message );
                }); 
    },
    updateFollowUser : function( user_id, newFollows ){
        return userModel
                .updateOne({ _id: user_id },{ $set : { follows : newFollows }})
                .then( userUpdated => {
                    return userUpdated;
                })
                .catch( err => {
                    return err;
                });
    }
}

module.exports = {
    Users
};