import axios  from 'axios'
import {createAlert} from './alert'

export const updateSetting = async (userInfo,type) =>{
    console.log(userInfo)
    const url =`/api/v1/users/${type==="password"?"updatePassword":"updateSelf"}`
    
    const data = type === "password"?{currentPassword:userInfo.currentPassword,newPassword:userInfo.newPassword,
    confirmPassword:userInfo.confirmPassword}:
          userInfo
    try{
    const res = await axios({
        method:'patch',
        url,
        data
    }) 
    if(res.data.message){
        createAlert(`${type} successfully updated`,true)
        location.reload(true)
    }
}catch(error){
       createAlert(`${error.response.data.message}`,false)
}   
}

