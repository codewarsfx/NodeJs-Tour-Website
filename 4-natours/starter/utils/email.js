const nodemailer = require('nodemailer');



const sendMail = async options=>{
    // create a transporter. the transporter is simply the message sending service 
      const transporter =  nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user:process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASSWORD
    }
  });
      //define the email options 
      const emailOptions = {
      from:"Codewarsfx <Chiderainnocent001@gmail.com>",
      to:options.email,
      subject: options.subject,
      text:options.message
      }
    
  await transporter.sendMail(emailOptions)

}

module.exports = sendMail




