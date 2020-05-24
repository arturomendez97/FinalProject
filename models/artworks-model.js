const mongoose = require( 'mongoose' );

const artworkSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users',
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
    //image
});

const artworkModel = mongoose.model( 'artworks', artworkSchema );

const Artworks = {
    addArtwork : function( newArtwork ){
        return artworkModel
                .create( newArtwork )
                .then( artwork => {
                    return artwork;
                })
                .catch( err => {
                    throw new Error( err.message );
                });
    },
    getAllArtworks : function(){
        return artworkModel
                .find()
                .populate('author', ['username'] )
                .then( artworks => {
                    return artworks;
                })
                .catch( err => {
                    throw new Error( err.message );
                });
    },
    getArtworksByID : function( id ){
        return artworkModel
            .findOne( { _id : id } )
                .then( artworks => {
                    return artworks;
                })
                .catch( err => {
                    throw new Error( err.message );
                });
    },
    getArtworksByAuthorId : function( _id ){
        return artworkModel
                .find( { author : _id } )
                .then( artworks => {
                    return artworks;
                })
                .catch( err => {
                    throw new Error( err.message );
                });
    }
}

module.exports = {
    Artworks
};