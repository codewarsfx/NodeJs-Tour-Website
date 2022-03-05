/*eslint-disable*/

const loginUser = async (email,password)=>{
    try{
    const res = await axios({
        method:'post',
        url:'/api/v1/users/login',
        data:{
            email,
            password
        }
    })
    
    console.log(res)
}
    catch(error){
        console.log(error)
    }
    
}

document.querySelector('form').addEventListener('submit',(e)=>{
    
    e.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    
    loginUser(email,password)
})

