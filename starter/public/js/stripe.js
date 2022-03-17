import axios from 'axios'

export const checkoutStripe = async (tourID)=>{
    
    const res = await  axios({
        method: 'post',
        url:`/api/v1/bookings/bookings-sessions/${tourID}`
        
    })
   window.location.replace(res.data.url)
    
}