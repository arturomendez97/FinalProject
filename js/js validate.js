let formElements = document.getElementsByClassName("formElement")

let f_Name = formElements[0]

//Esto no jala, no se ve porque no se le puede appendear a un input
let f_Name_Message = document.createElement("span")
f_Name_Message.innerText = "hello"
f_Name.append(f_Name_Message)

let l_Name = formElements[1]
let email = formElements[2]
let phone = formElements[3]

let buttons = document.querySelectorAll(".clickable");

let btn_Reset = buttons[0]
let btn_Submit = buttons[1]

console.log(f_Name)
console.log(l_Name)
console.log(email)
console.log(phone)
console.log(btn_Submit)
console.log(btn_Reset)

function triggerForm(event){
    event.preventDefault();
    console.log("hello")

    if (f_Name.value == "") {
        console.log("empty")
    }
}

btn_Submit.addEventListener("click", triggerForm)