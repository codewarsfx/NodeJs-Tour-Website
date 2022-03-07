import {loginUser, logoutUser} from './login'



const domElements = {
    emailELement: document.querySelector('#email'),
    passwordElement: document.querySelector('#password'),
    formElement: document.querySelector('.form'),
    logOut: document.querySelector('.logout') 
}




if(domElements.formElement){
    
  domElements.formElement.addEventListener('submit',(e)=>{
        e.preventDefault()
        
        emailValue = domElements.emailELement.value,
        passwordValue = domElements.passwordElement.value
        
        
        loginUser(emailValue,passwordValue)
        
        
    })
    
    
    
    
}

if(domElements.logOut){
    domElements.logOut.addEventListener('click',()=>{
        logoutUser()
        // location.reload(true)
        
    })
}