
function userSignupFetch( username, email, password, description ){
    let url = '/api/users/register';

    let data = {
        username,
        email,
        password,
        description
    }

    let settings = {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector( '.signup_Results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            userLoginFetch( data.email, data.password )
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function userLoginFetch( email, password ){
    let url = '/api/users/login';

    let data = {
        email,
        password
    }

    let settings = {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector( '.login_Results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            localStorage.setItem( 'token', responseJSON.token );
            window.location.href = "/pages/home.html";
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function watchLoginForm(){
    let loginForm = document.querySelector( '.login' );

    loginForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let email = document.getElementById( 'email_Login' ).value;
        let password = document.getElementById( 'password_Login' ).value;

        userLoginFetch( email, password );
    })
}

function watchSignupForm(){
    let loginForm = document.querySelector( '.signup' );

    loginForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let username = document.getElementById( 'username_Signup' ).value;
        let email = document.getElementById( 'email_Signup' ).value;
        let password = document.getElementById( 'password_Signup' ).value;
        let description = document.getElementById( 'description_Signup' ).value;

        userSignupFetch( username, email, password, description );
    })
}




function navigationBarEvent(){
    let navigationElements = document.getElementsByClassName("menu")
    //console.log(navigationElements)

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
/*
function lowerNavigationBarEvent(){
    let navigationElements = document.getElementsByClassName("lowerMenu")
    console.log(navigationElements)

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

/*
function artworkPageEvent(){
    let navigationElements = document.getElementsByClassName("thumbnail")
    console.log(navigationElements)

    let artworkSection = document.getElementsByClassName("artworkSection")

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

            console.log(rightSide)
            rightSide.innerHTML = `<img class = "artwork" src = ${currentElement.src} height="700" width="800" alt= "Artwork">`

        });
}
}
*/
function init(){
    navigationBarEvent();
    //lowerNavigationBarEvent();
    //artworkPageEvent();
    watchLoginForm();
    watchSignupForm();
}

init();