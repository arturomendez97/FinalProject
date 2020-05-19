//Importar express
const express = require( 'express' );

//Generar objeto con express function
const app = express();

let userList = [
    {
        username : "AMendez",
        password : "12345",
        id : "123",
        description : "New to art"
    },
    {
        username : "AMendez",
        password : "12345",
        id : "456",
        description : "New to art"
    },
    {
        username : "AMendez",
        password : "12345",
        id : "789",
        description : "New to art"
    },

]

//Get all users
app.get( '/users', ( req, res ) =>{
    console.log("Getting list of all users.");
    return res.status( 200 ).json( userList );

});

app.get( '/userById', ( req, res ) =>{
    console.log("Getting a user given the id parameter.");

});

app.listen( 8080, () => {
    console.log("This server is running on port 8080");
});

//Base URL : http://localhost:8080
//GET Users : http://localhost:8080/users
//GET User by id : http://localhost:8080/userById?id=123