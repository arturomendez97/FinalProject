var currentUserId = ";"

function getArtworks( responseJSON ){
    let url = `/api/get-artworksbyid?_id=${responseJSON._id}`;

    let settings = {
        method : 'GET'
    }
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            console.log(responseJSON)
            return responseJSON;
        })
        .catch( err => {
            console.log( err.message );
        });
}

function getUser(){
    console.log(currentUserId)
    let url = `/api/get-userby_id?_id=${currentUserId}`;

    let settings = {
        method : 'GET'
    }

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            return responseJSON;
        })
        .catch( err => {
            console.log( err.message );
        });


}

function validateUser(){
    let url = "/api/validate-user";
    let settings = {
        method : 'GET',
        headers : {
            sessiontoken : localStorage.getItem( 'token' )
        }
    };

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }

            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            setProfile( responseJSON );
            currentUserId = responseJSON._id;
            setArtworks();
        })
        .catch( err => {
            console.log( err.message );
            window.location.href = "../index.html";
        });
}

function setProfile( responseJSON ){

    //responseJSON tiene el objeto del usuario.
    let profileUsername = document.querySelector(".profileUsername");
    let profileDescription = document.querySelector(".profileDescription");
    let profileFollows = document.querySelector(".following");
    let galleryProfile = document.querySelector(".galleryProfile");

    //Get artworks by user id
    let url = `/api/get-artworksbyid?_id=${responseJSON._id}`;
    let settings = {
        method : 'GET'
    }
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( userArtworks => {
            galleryProfile.innerHTML = "";
            for (k = 0; k< userArtworks.length; k++) {
                //PAra cuando ponga una imagen, a la imagen le puedo poner el id del artwork para encontrarlo despues
                galleryProfile.innerHTML += `
                <div class = "thumbnail" >
                    <img src = "./../assets/1.png" height="238" width="238" alt= "Artwork" id = "${userArtworks[k]._id}">
                    </div>
                `
            }

            //Set following
            profileFollows.innerHTML = ''
            for (i = 0; i < responseJSON.follows.length; i++) {
                profileFollows.innerHTML += `
                <p class = "followingText"> ${responseJSON.follows[i]} </p>
                `
            } 
            

            profileUsername.innerHTML = `${responseJSON.username}`;
            profileDescription.innerHTML = `${responseJSON.description}`;
        })
        .catch( err => {
            console.log( err.message );
        });

}

function setArtworks(){

    let homeRecentGallery = document.querySelector(".recentSection");
    let homeFollowingGallery = document.querySelector(".followingSection");
    //Get all artworks for homepage
    let url = '/api/artworks';
    let settings = {
        method : 'GET'
    }
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( artworks => {
            homeRecentGallery.innerHTML = ''
            for (k = 0; k< artworks.length; k++) {
                //PAra cuando ponga una imagen, a la imagen le puedo poner el id del artwork para encontrarlo despues
                homeRecentGallery.innerHTML += `
                <div class = "thumbnail" >
                    <img src = "./../assets/1.png" height="238" width="238" alt= "Artwork" id = "${artworks[k]._id}">
                    </div>
                `
            }
        })
        .catch( err => {
            console.log( err.message );
        });


    //Get artworks from people you follow
    let url2 = `/api/get-userby_id?_id=${currentUserId}`;

        fetch( url2, settings )
            .then( response => {
                if( response.ok ){
                    return response.json();
                }
                throw new Error( response.statusText );
            })
            .then( responseJSON => {

                //For all the profile's follows
                for (k = 0; k< responseJSON.follows.length; k++){
                    //For each of them, get and display all their art
                    let url = `/api/get-artworksbyid?_id=${responseJSON.follows[k]}`;

                    let settings = {
                        method : 'GET'
                    }
                    fetch( url, settings )
                        .then( response => {
                            if( response.ok ){
                                return response.json();
                            }
                            throw new Error( response.statusText );
                        })
                        .then( artworks => {
                            homeFollowingGallery.innerHTML = ''
                            for (i = 0; i < artworks.length; i++){
                                homeFollowingGallery.innerHTML += `
                                <div class = "thumbnail" >
                                    <img src = "./../assets/1.png" height="238" width="238" alt= "Artwork" id = "${artworks[i]._id}">
                                    </div>
                                `
                            }
                        })
                        .catch( err => {
                            console.log( err.message );
                        });
                    
                }
                
            })
            .catch( err => {
                console.log( err.message );
            });
}

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

function navigationBarEvent(){
    let navigationElements = document.getElementsByClassName("menu")

    for (let i = 0; i < navigationElements.length; i++){
        navigationElements[i].addEventListener("click", (event) => {

            //Esconde la que está desplegada actualmente.
            let selectedSection = document.querySelector(".selectedSection");
            selectedSection.classList.add("hidden");
            selectedSection.classList.remove("selectedSection");

            //Quitar lo gris del menu de arriba
            let selectedMenu = document.querySelector(".activeOption");
            selectedMenu.classList.remove("activeOption");

            //event.target se usa para targetear al elemento al que se le hizo click.
            let currentElement = event.target.id;
            //También podría ser ("." + currentElement + "Section")
            let elementToShow = document.querySelector(`.${currentElement}Section`);
            //Mostrar al que se le hizo click
            elementToShow.classList.remove("hidden");
            elementToShow.classList.add("selectedSection");

            //Poner lo del gris del menu de arriba
            let menuToShow = document.getElementById(currentElement)
            menuToShow.classList.add("activeOption");
            

        });
    }

}

function lowerNavigationBarEvent(){
    let navigationElements = document.getElementsByClassName("lowerMenu")

    for (let i = 0; i < navigationElements.length; i++){
        navigationElements[i].addEventListener("click", (event) => {

            //Esconde la que está desplegada actualmente.
            let selectedSection = document.querySelector(".lowerSelectedSection");
            selectedSection.classList.add("hidden");
            selectedSection.classList.remove("lowerSelectedSection");

            //Quitar lo gris del menu de arriba
            let selectedMenu = document.querySelector(".lowerActiveOption");
            selectedMenu.classList.remove("lowerActiveOption");

            //event.target se usa para targetear al elemento al que se le hizo click.
            let currentElement = event.target.id;
            //También podría ser ("." + currentElement + "Section")
            let elementToShow = document.querySelector(`.${currentElement}Section`);
            //Mostrar al que se le hizo click
            elementToShow.classList.remove("hidden");
            elementToShow.classList.add("lowerSelectedSection");

            //Poner lo del gris del menu de arriba
            let menuToShow = document.getElementById(currentElement)
            menuToShow.classList.add("lowerActiveOption");
            

        });
    }
}

function artworkPageEvent(){
    let navigationElements = document.getElementsByClassName("gallery")


    for (let i = 0; i < navigationElements.length; i++){
        navigationElements[i].addEventListener("click", (event) => {

            //Esconde la que está desplegada actualmente.
            let selectedSection = document.querySelector(".selectedSection");
            selectedSection.classList.add("hidden");
            selectedSection.classList.remove("selectedSection");

            //event.target se usa para targetear al elemento al que se le hizo click.
            let currentElement = event.target;
            let currentName = currentElement.alt
            //También podría ser ("." + currentElement + "Section")
            let elementToShow = document.querySelector(`.${currentName}Section`);
            //Mostrar al que se le hizo click
            elementToShow.classList.remove("hidden");
            elementToShow.classList.add("selectedSection");

            let rightSide = document.querySelector(".display");

            rightSide.innerHTML = `<img class = "artwork" src = ${currentElement.src} height="700" width="800" alt= "Artwork">`

            //Cosas que necesitaremos cambiar en la página del artwork
            let artworkName = document.querySelector(".artworkName");
            let artworkDescription = document.querySelector(".artworkDescription")
            let btns = document.querySelector(".btns")
            let usernameText = document.querySelector(".usernametext")
            let userDescription = document.querySelector(".userDescription")
            let followBtnDiv = document.querySelector(".followBtnDiv")
            let commentsContainer = document.querySelector(".comments")


            // Ahora hacemos fetch al artwork con el id que tiene la imagen
            let url = `/api/get-artworkbyid?_id=${currentElement.id}`;
            let settings = {
                method : 'GET'
            }
            fetch( url, settings )
                .then( response => {
                    if( response.ok ){
                        return response.json();
                    }
                    throw new Error( response.statusText );
                })
                .then( artwork => {
                    artworkName.innerHTML = `${artwork.name}`
                    artworkDescription.innerHTML = `${artwork.description}`

                    //Ahora hay que obtener el usuario al que le pertenece este artwork para poner sus datos.
                    //Conviene ponerle su id al boton de follow. Y poner el id del artwork al boton de fav y like.
                    //También hay que ocultar esos botones si el artwork es tuyo.

                    let url = `/api/get-userby_id?_id=${artwork.author}`;

                    let settings = {
                        method : 'GET'
                    }

                    fetch( url, settings )
                        .then( response => {
                            if( response.ok ){
                                return response.json();
                            }
                            throw new Error( response.statusText );
                        })//Este es el usuario al que le pertenece el artwork
                        .then( responseJSON => {
                            
                            //obtenemos nuestro usuario, para saber si los botones agregaran o quitaran el like/fav/ y follow
                            let url = `/api/get-userby_id?_id=${currentUserId}`

                            let settings = {
                                method : 'GET'
                            }

                            fetch( url, settings )
                                .then( response => {
                                    if( response.ok ){
                                        return response.json();
                                    }
                                    throw new Error( response.statusText );
                                })
                                .then( currentUserJSON => {
                                    
                                    if (currentUserId != responseJSON._id){

                                        //Checa si el usuario ya le da follow a este otro usuario para que el boton diga follow o unfollow
                                        if (currentUserJSON.follows.includes(responseJSON._id)){
                                            btns.innerHTML = `
                                            <button class = "likeBtn" type="button" name = "${artwork._id}">Un-Like</button> 
                                            <button class = "favBtn" type="button" name = "${artwork._id}">Un-Favorite</button> 
                                            `
                                            followBtnDiv.innerHTML = `
                                            <button class = "followBtn" type="button" id = "${responseJSON._id}">Un-Follow</button> 
                                            `
                                        }
                                        else{
                                            btns.innerHTML = `
                                            <button class = "likeBtn" type="button" name = "${artwork._id}">Like</button> 
                                            <button class = "favBtn" type="button" name = "${artwork._id}">Favorite</button> 
                                            `
                                            followBtnDiv.innerHTML = `
                                            <button class = "followBtn" type="button" id = "${responseJSON._id}">Follow</button> 
                                            `
                                        }

                                    }
                                    else{
                                        btns.innerHTML = `
                                        <button class = "likeBtn hidden" type="button" name = "${artwork._id}">Like</button> 
                                        <button class = "favBtn hidden" type="button" name = "${artwork._id}">Favorite</button> 
                                        `
                                        followBtnDiv.innerHTML = `
                                        <button class = "followBtn hidden" type="button" id = "${responseJSON._id}">Follow</button> 
                                        `
                                    }
        
                                    watchLikeFaveFollowBtns();
                                    
        
                                    usernameText.innerHTML = `${responseJSON.username}`
                                    userDescription.innerHTML = `${responseJSON.description}`
        
                                    //Ahora obtenemos todos los comentarios para este artwork.
                                    let url = `/api/get-commentsbyArtwork?_id=${artwork._id}`;
        
                                    let settings = {
                                        method : 'GET',
                                    }
        
                                    fetch( url, settings )
                                        .then( response => {
                                            if( response.ok ){
                                                return response.json();
                                            }
                                            throw new Error( response.statusText );
                                        })
                                        .then( commentsJSON => {
                                            commentsContainer.innerHTML = ""
                                            
                                            
                                            for (k = 0; k< commentsJSON.length; k++) {
                                                commentsContainer.innerHTML += `
                                                <div class = "comment"> 
                                                    <div class = "commentUser">
                                                    ${commentsJSON[k].author.username}
                                                    </div>
                                                    <div class = "commentText">
                                                    ${commentsJSON[k].content}
                                                    </div>
                                                </div>
                                                `
                                            }
        
                                        })
                                        .catch( err => {
                                            console.log( err.message );
                                            commentsContainer.innerHTML = ""
                                        });

                                })
                                .catch( err => {
                                    console.log( err.message );
                                });

                        })
                        .catch( err => {
                            console.log( err.message );
                        });
                })
                .catch( err => {
                    console.log( err.message );
                });


        });
    }
}

function watchCommentForm(){
    let commentForm = document.querySelector(".commentForm");
    let commentsContainer = document.querySelector(".comments")

    commentForm.addEventListener( 'submit' , ( event ) => {

        let content = document.querySelector( '.inputComment' ).value;
        let contentContainer = document.querySelector( '.inputComment' );
        event.preventDefault()

        //Validation
        if (content != ""){
            //Create comment
        let artwork_id = document.querySelector(".likeBtn").name

        let url = "/api/create-comment";

        let data = {
            content,
            artwork_id
        }


        let settings = {
        method : 'POST',
        headers : {
            sessiontoken : localStorage.getItem( 'token' ),
            'Content-Type' : 'application/json'
            },
            body : JSON.stringify( data )
        };

        fetch( url, settings )
            .then( response => {
                if( response.ok ){
                    return response.json();
                }

                throw new Error( response.statusText );
            })
            .then( responseJSON => {

                //Conseguir el user por id para poner su nombre en el comment.
                let url = `/api/get-userby_id?_id=${responseJSON.author}`;

                    let settings = {
                        method : 'GET'
                    }

                    fetch( url, settings )
                        .then( response => {
                            if( response.ok ){
                                return response.json();
                            }
                            throw new Error( response.statusText );
                        })
                        .then( userJSON => {
                            //Display comment
                            commentsContainer.innerHTML += `
                            <div class = "comment"> 
                                <div class = "commentUser">
                                ${userJSON.username}
                                </div>
                                <div class = "commentText">
                                ${responseJSON.content}
                                </div>
                            </div>
                            `
                            
                            
                        })
                        .catch( err => {
                            console.log( err.message );
                        });
                //Y borrar el field
                contentContainer.value = '';

            })
            .catch( err => {
                console.log( err.message );
            });
        }
        else{
            contentContainer.placeholder="Gotta write something first!"
        }

        
            

    })
}


function watchLikeFaveFollowBtns(){
    //let btnsContainer = document.querySelector( '.artworkContainer' );
    let likeBtn = document.querySelector( ".likeBtn");
    let followBtn = document.querySelector( ".followBtn");
    let FavButton = document.querySelector( ".favBtn");

        
    followBtn.addEventListener( 'click', ( event ) =>{
        //If -1 delete follower, if 1, add follower
        if( followBtn.innerHTML == "Un-Follow"){
            updateFollow(followBtn, -1)
        }
        else{
            updateFollow(followBtn, 1)
        }

        let url = `/api/get-userby_id?_id=${currentUserId}`;

        let settings = {
            method : 'GET'
        }

        fetch( url, settings )
            .then( response => {
                if( response.ok ){
                    return response.json();
                }
                throw new Error( response.statusText );
            })
            .then( responseJSON => {
                setProfile( responseJSON );
                setArtworks();

            })
            .catch( err => {
                console.log( err.message );
            });

    })

}

function updateFollow(followBtn, modify){
    let url = "/api/users/updatefollow";

        let data = {
            user_id : currentUserId,
            followUser : followBtn.id,
            modify
        }

        let settings = {
        method : 'PATCH',
        headers : {
            sessiontoken : localStorage.getItem( 'token' ),
            'Content-Type' : 'application/json'
            },
            body : JSON.stringify( data )
        };

        fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            if (modify == 1){
                followBtn.innerHTML = "Un-Follow"
            }
            else{
                followBtn.innerHTML = "Follow"
            }

        })
        .catch( err => {
            console.log( err.message );
        });
}


function watchLogoutButton(){
    let logOutBtn = document.querySelector( '.logOut' );

    logOutBtn.addEventListener( 'click' , ( event ) => {
        localStorage.removeItem( 'token' );
        window.location.href = "../index.html";
    })
}

function watchUploadFOrm(){
    let uploadForm = document.querySelector( '.uploadArt' );

    uploadForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let name = document.getElementById( 'artworkName_Upload' ).value;
        let description = document.getElementById( 'description_Upload' ).value;

        data = {
            name,
            description
        }

        let url = "/api/create-artwork";
        let settings = {
            method : 'POST',
            headers : {
                sessiontoken : localStorage.getItem( 'token' ),
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify( data )
        };

        fetch( url, settings )
            .then( response => {
                if( response.ok ){
                    return response.json();
                }

                throw new Error( response.statusText );
            })
            .then( responseJSON => {
                console.log(responseJSON)
            })
            .catch( err => {
                console.log( err.message );
                window.location.href = "../index.html";
            });

    })
}

function init(){
    //Startup
    validateUser();

    navigationBarEvent();
    lowerNavigationBarEvent();
    artworkPageEvent();
    watchLogoutButton();
    //watchLikeFaveFollowBtns();
    watchCommentForm();
    watchUploadFOrm();
}

init();