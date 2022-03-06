import {shoutHello } from './login'

const formElement= document.querySelector('form')
if(formElement){
    formElement.addEventListener('submit',(e)=>{
    
    e.preventDefault()
    
    const inputEmail =  document.getElementById('email')
    const inputPassword = document.getElementById('password')

    if(inputEmail&& inputPassword){
            const email = inputEmail.value
            const password = inputPassword.value
            loginUser(email,password)
    }

})   
}


console.log('hey')
shoutHello()

