export const hideAlert = ()=>{
     const el =document.querySelector('.alert')
     if(el)el.parentElement.childNodes[0].remove();
     
}

export const createAlert= (message,type,duration) =>{

     const el = `<div class='alert alert--${type?'success':'error'}'>${message}</div>`
     
     document.querySelector("body").insertAdjacentHTML('afterbegin',el)
     
     window.setTimeout(hideAlert,duration)
    
}

