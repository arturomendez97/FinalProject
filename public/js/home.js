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
            currentUserId = responseJSON._id;
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
                .then( userJSON => {

                    setProfile( userJSON );
                    setArtworks();

                    let uploadForm = document.querySelector(".uploadArt");
                    uploadForm.innerHTML += `
                    <input type = "text" id = "user_id" class = "formElement hidden" name = "user_id" value = "${currentUserId}"/>
                    <input type = "text" id = "user_token" class = "formElement hidden" name = "user_token" value = "${localStorage.getItem( 'token' )}"/>
                    `
                    
                })
                .catch( err => {
                    console.log( err.message );
                });
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
    let profileLikes = document.querySelector(".likesGalleryProfile");
    let profileFavs = document.querySelector(".FavsGalleryProfile");

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
                <div class = "profileThumbnail" >
                    <img src = "./../${userArtworks[k].path}" height="238" width="238" alt= "Artwork" id = "${userArtworks[k]._id}">
                    </div>
                `
            }

            //Set following
            profileFollows.innerHTML = ''
            for (i = 0; i < responseJSON.follows.length; i++) {
                
                let url = `/api/get-userby_id?_id=${responseJSON.follows[i]}`;

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
                    .then( extUserJSON => {
                        //console.log(extUserJSON)
                        profileFollows.innerHTML += `
                        <h1 id = "externalUserProfile" name = "${extUserJSON._id}"> ${extUserJSON.username} </h1>
                        `
                    })
                    .catch( err => {
                        console.log( err.message );
                    });
                
            } 
            profileUsername.innerHTML = `${responseJSON.username}`;
            profileDescription.innerHTML = `${responseJSON.description}`;

            //Set likes
            //Get each artwork by id and put it there
            profileLikes.innerHTML = ''
            profileFavs.innerHTML = ''
            for (j = 0; j< responseJSON.likes.length; j++){

                //Fetchear artworks de likes
                let url = `/api/get-artworkbyid?_id=${responseJSON.likes[j]}`;

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
                        profileLikes.innerHTML = `
                        <div class = "profileThumbnail" >
                            <img src = "./../${responseJSON.path}" height="238" width="238" alt= "Artwork" id = "${responseJSON._id}">
                            </div>
                        `
                    })
                    .catch( err => {
                        console.log( err.message );
                    });
            }

            //Fetchear artworks de favs
            for (j = 0; j< responseJSON.favorites.length; j++){
                let url2 = `/api/get-artworkbyid?_id=${responseJSON.favorites[j]}`;

                let settings2 = {
                    method : 'GET'
                }
                fetch( url2, settings2 )
                    .then( response => {
                        if( response.ok ){
                            return response.json();
                        }
                        throw new Error( response.statusText );
                    })
                    .then( responseJSON => {
                        profileFavs.innerHTML = `
                        <div class = "profileThumbnail" >
                            <img src = "./../${responseJSON.path}" height="238" width="238" alt= "Artwork" id = "${responseJSON._id}">
                            </div>
                        `
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

function setSearchGallery( searchTerm ){
    let searchGallery = document.querySelector(".searchSection")

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
            searchGallery.innerHTML = ''
            for (k = 0; k< artworks.length; k++) {
                if (artworks[k].name.includes( searchTerm ) || artworks[k].description.includes( searchTerm ) || artworks[k].author.username.includes( searchTerm )){
                    searchGallery.innerHTML += `
                    <div class = "thumbnail" >
                        <img src = "./../${artworks[k].path}" height="238" width="238" alt= "Artwork" id = "${artworks[k]._id}">
                        </div>
                    `
                }
            }
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
                //console.log(artworks[k].path)
                //PAra cuando ponga una imagen, a la imagen le puedo poner el id del artwork para encontrarlo despues
                homeRecentGallery.innerHTML += `
                <div class = "thumbnail" >
                    <img src = "./../${artworks[k].path}" height="238" width="238" alt= "Artwork" id = "${artworks[k]._id}">
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

                homeFollowingGallery.innerHTML = ''
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
                            for (i = 0; i < artworks.length; i++){
                                homeFollowingGallery.innerHTML += `
                                <div class = "thumbnail" >
                                    <img src = "./../${artworks[i].path}" height="238" width="238" alt= "Artwork" id = "${artworks[i]._id}">
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

            //Caso específico para cuando le das click al nombre del usuario en un artwork. Para no repetir el id
            if (currentElement == "externalUserProfile"){
                currentElement = "profile"
            }

            //Para cuando andas en el profile de alguién mas pero le das click al button profile, para que se muestre el tuyo de nuevo
            if (currentElement == "profile"){
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
                        setProfile(responseJSON);
                    })
                    .catch( err => {
                        console.log( err.message );
                    });
            }
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

function searchEvent(){
    let searchForm = document.querySelector(".searchForm")
    console.log("The term searche");


    
    searchForm.addEventListener('submit', () => {
        event.preventDefault()
        let search = document.querySelector(".search").value
        
        //Esconde la que está desplegada actualmente.
        let lowerSelectedSection = document.querySelector(".lowerSelectedSection");
        lowerSelectedSection.classList.add("hidden");
        lowerSelectedSection.classList.remove("lowerSelectedSection");
        //Esconde la que está desplegada actualmente.
        let selectedSection = document.querySelector(".selectedSection");
        selectedSection.classList.add("hidden");
        selectedSection.classList.remove("selectedSection");

        //Quitar lo gris del menu de arriba
        let loweSelectedMenu = document.querySelector(".lowerActiveOption");
        loweSelectedMenu.classList.remove("lowerActiveOption");
        //Quitar lo gris del menu de arriba
        let selectedMenu = document.querySelector(".activeOption");
        selectedMenu.classList.remove("activeOption");

        //También podría ser ("." + currentElement + "Section")
        let lowerElementToShow = document.querySelector('.searchSection');
        //Mostrar al que se le hizo click
        lowerElementToShow.classList.remove("hidden");
        lowerElementToShow.classList.add("lowerSelectedSection");
        lowerElementToShow.classList.add("lowerActiveOption");
        //También podría ser ("." + currentElement + "Section")
        let elementToShow = document.querySelector('.homeSection');
        //Mostrar al que se le hizo click
        elementToShow.classList.remove("hidden");
        elementToShow.classList.add("selectedSection");
        elementToShow.classList.add("activeOption");

        


        setSearchGallery( search )
       })
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
                                            followBtnDiv.innerHTML = `
                                            <button class = "followBtn" type="button" id = "${responseJSON._id}">Un-Follow</button> 
                                            `
                                        }
                                        else{
                                            followBtnDiv.innerHTML = `
                                            <button class = "followBtn" type="button" id = "${responseJSON._id}">Follow</button> 
                                            `
                                        }
                                        //same pero con like
                                        if (currentUserJSON.likes.includes(artwork._id)){
                                            btns.innerHTML = `
                                            <button class = "likeBtn" type="button" name = "${artwork._id}">Un-Like</button> `
                                        }
                                        else{
                                            btns.innerHTML = `
                                            <button class = "likeBtn" type="button" name = "${artwork._id}">Like</button> `
                                        }
                                        //Same pero con fav
                                        if (currentUserJSON.favorites.includes(artwork._id)){
                                            btns.innerHTML += `
                                            <button class = "favBtn" type="button" name = "${artwork._id}">Un-Favorite</button> 
                                            `
                                        }
                                        else{
                                            btns.innerHTML += `
                                            <button class = "favBtn" type="button" name = "${artwork._id}">Favorite</button> 
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
                                    usernameText.name = responseJSON._id
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

function watchArtworkUser(){
    let artworkUser = document.getElementsByClassName("userLink")
    //console.log(artworkUser)

    for(i=0;i<artworkUser.length;i++){
        artworkUser[i].addEventListener( 'click' , ( event ) =>{
            if (event.target.id = "externalUserProfile"){
                //Get user by id and pass it to setprofile.
            let url = `/api/get-userby_id?_id=${event.target.getAttribute("name")}`;
            console.log(event.target)
    
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
                    setProfile(responseJSON)
                })
                .catch( err => {
                    console.log( err.message );
                });
            }
        })
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
    let favBtn = document.querySelector( ".favBtn");

        
    followBtn.addEventListener( 'click', ( event ) =>{
        //If -1 delete follower, if 1, add follower
        if( followBtn.innerHTML == "Un-Follow"){
            updateFollow(followBtn, -1)
        }
        else{
            updateFollow(followBtn, 1)
        }
    })

    likeBtn.addEventListener( 'click', ( event ) =>{
        //If -1 delete like, if 1, add like
        if( likeBtn.innerHTML == "Un-Like"){
            updateLike(likeBtn, -1)
        }
        else{
            updateLike(likeBtn, 1)
        }
    })

    favBtn.addEventListener( 'click', ( event ) =>{
        //If -1 delete like, if 1, add like
        if( favBtn.innerHTML == "Un-Favorite"){
            updateFavorite(favBtn, -1)
        }
        else{
            updateFavorite(favBtn, 1)
        }
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
            let url2 = `/api/get-userby_id?_id=${currentUserId}`;

            let settings2 = {
                method : 'GET'
            }

            fetch( url2, settings2 )
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
        .catch( err => {
            console.log( err.message );
        });
}

function updateLike(likeBtn, modify){
    let url = "/api/users/updatelike";

        let data = {
            user_id : currentUserId,
            artwork_id : likeBtn.name,
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
                likeBtn.innerHTML = "Un-Like"
            }
            else{
                likeBtn.innerHTML = "Like"
            }
            let url2 = `/api/get-userby_id?_id=${currentUserId}`;

            let settings2 = {
                method : 'GET'
            }

            fetch( url2, settings2 )
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
        .catch( err => {
            console.log( err.message );
        });
}

function updateFavorite(favBtn, modify){
    let url = "/api/users/updatefavorite";

        let data = {
            user_id : currentUserId,
            artwork_id : favBtn.name,
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
                favBtn.innerHTML = "Un-Favorite"
            }
            else{
                favBtn.innerHTML = "Favorite"
            }
            let url2 = `/api/get-userby_id?_id=${currentUserId}`;

            let settings2 = {
                method : 'GET'
            }

            fetch( url2, settings2 )
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
        window.location.href = "../index.html";

        

        data = {
            name,
            description,
            image
        }
        /*
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
            });*/

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
    //watchUploadFOrm();
    searchEvent();
    watchArtworkUser();
}

init();