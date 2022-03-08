import {loginUser, logoutUser} from './login'
import {updateUserInfo} from './updateUser'



const domElements = {
    emailELement: document.querySelector('#email'),
    nameELement: document.querySelector('#name'),
    passwordElement: document.querySelector('#password'),
    formElement: document.querySelector('.l'),
    formUserELement:document.querySelector('.form-user-data'),
    logOut: document.querySelector('.logout'),
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
        
    })
}


if(domElements.formUserELement){

    domElements.formUserELement.addEventListener('submit' ,e=>{
        e.preventDefault()
    
        
        const nameValue = domElements.nameELement.value
        
        const emailValue =domElements.emailELement.value
        
        updateUserInfo({nameValue,emailValue})
    })

}