/*eslint-disable*/
import axios from 'axios'
import {createAlert} from './alert'

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

    if(res.data.message){
        createAlert("successfully logged in",true,5000)
        window.setTimeout(()=>{
        location.assign('/')
    },150)
    }
}
    catch(error){
         createAlert(error.response.data.message, false,5000)
    }
    
}



export const logoutUser = async ()=>{
    try{
    const res= await axios(
        {
        method:'get',
        url:'/api/v1/users/logOut',
    })
    if(res.data.message){
        if(window.location.pathname =="/me"){
            window.assign('/')
        }
        else{
             location.reload(true)
        }
    }
    }
    catch(error){
        createAlert('error logging out',false,5000)
    }
 
    
}



