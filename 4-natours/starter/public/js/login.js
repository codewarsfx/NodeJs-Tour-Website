/*eslint-disable*/
console.log('hey')

document.querySelector('.form').addEventListener('submit',e=>{
    console.log('hey')
    e.preventDefault()
    const email= document.getElementById('email').value
    const password= document.getElementById('password').value
    
    console.log(email,password)
})