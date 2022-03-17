import {loginUser, logoutUser} from './login'
import {updateSetting, updateUserInfo} from './updateUser'
import {checkoutStripe} from './stripe'



const domElements = {
    emailELement: document.querySelector('#email'),
    nameELement: document.querySelector('#name'),
    passwordElement: document.querySelector('#password'),
    formElement: document.querySelector('.l'),
    formUserELement:document.querySelector('.form-user-data'),
    logOut: document.querySelector('.logout'),
    currentPasswordElement: document.querySelector('#password-current'),
    newPasswordElement : document.querySelector('#password'),
    confirmPasswordELement: document.querySelector('#password-confirm'),
    passwordFormElement:document.querySelector('.password-form'),fileUploadElement: document.getElementById('photo'),
    buttonElement: document.querySelector('.checkout-button')
}

if(domElements.buttonElement){
    domElements.buttonElement.addEventListener('click',async(e)=>{
        e.target.textContent ='processing...'
        
        const tourID = domElements.buttonElement.dataset.tour
       await  checkoutStripe(tourID)
       
       e.target.textContent ='Book a Tour '
    })
    
    
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
        e.preventDefault(domElements.fileUploadElement.files)

        const form = new FormData()
       
       form.append('nameValue',domElements.nameELement.value);
       form.append('emailValue',domElements.emailELement.value);
       form.append('photo',domElements.fileUploadElement.files[0]);
    
        updateSetting(form,'data')
    })

}
const btn = document.querySelector('.btn-save-pass')
if(btn){
    btn.addEventListener('click',()=>{
             btn.textContent = "Updating Password..."
        })
}
 
        
if(domElements.passwordFormElement){
    domElements.passwordFormElement.addEventListener('submit', async e=>{
        e.preventDefault()
       const currentPassword = domElements.currentPasswordElement.value
        const newPassword = domElements.newPasswordElement.value
        const confirmPassword = domElements.confirmPasswordELement.value
        
       await updateSetting({currentPassword,newPassword,confirmPassword},'password')
       
        btn.textContent ='Save password'
    })
    
}