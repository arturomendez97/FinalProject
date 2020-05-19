
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

function init(){
    navigationBarEvent();
    lowerNavigationBarEvent();
    artworkPageEvent();
}

init();