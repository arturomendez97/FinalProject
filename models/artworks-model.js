const mongoose = require( 'mongoose' );

const artworkSchema = mongoose.Schema({
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        required : true
    },
    description : {
        type : String,
        required : true
    },
    favorites: [{
        type: String
    }],
    likes: [{
        type: String
    }]
});

const artworkModel = mongoose.model( 'artworks', artworkSchema );

const Artworks = {
    /*
    addComment : function( newComment ){
        return commentModel
                .create( newComment )
                .then( comment => {
                    return comment;
                })
                .catch( err => {
                    throw new Error( err.message );
                });
    },
    getAllComments : function(){
        return commentModel
                .find()
                .populate('user', ['username'] )
                .then( comments => {
                    return comments;
                })
                .catch( err => {
                    throw new Error( err.message );
                });
    },
    getCommentsByAuthorId : function( id ){
        return commentModel
                .find( { author : id } )
                .populate( 'user', ['username'] )
                .then( comments => {
                    return comments;
                })
                .catch( err => {
                    throw new Error( err.message );
                });
    }*/
}

module.exports = {
    Artworks
};