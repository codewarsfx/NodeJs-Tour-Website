import axios  from 'axios'
import {createAlert} from './alert'

export const updateUserInfo = async (userInfo) =>{
    try{
    const res =await axios({
        method:'patch',
        url:'/api/v1/users/updateSelf',
        data:{
           email: userInfo.emailValue,
           name: userInfo.nameValue
        } 
    }) 
    if(res.data.message){
        createAlert('data successfully updated',true)
        location.reload(true)
    }
}catch(error){
       createAlert(`${error.response.data.message}`,false)
}   
}

