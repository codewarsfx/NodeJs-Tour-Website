/*eslint-disable*/
export const loginUser = async (email,password)=>{
    
    
    try{
    const res = await axios({
        method:'post',
        url:'/api/v1/users/login',
        data:{
            email,
            password
        }
    })
    
    
    if(res.data.sta)
    
    alert('user loggen in ')
    window.setTimeout(()=>{
        location.assign('/')
    },150)
}
    catch(error){
        console.log(error)
    }
    
}

export const shoutHello = ()=>{
    console.log('say hello from login')
}



