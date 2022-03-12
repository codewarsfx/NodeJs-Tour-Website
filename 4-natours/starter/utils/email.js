const nodemailer = require('nodemailer');
const nodemailerSengrid = require('nodemailer-sendgrid')
const pug = require('pug')
const {htmlToText} = require('html-to-text')

module.exports = class{
  constructor(user,url){
    this.url= url
    this.firstName = user.name.split(' ')[0]
    this.to = user.email
    this.from = `Chidera Innocent ${process.env.SENDER_EMAIL }`
    
  }
  
  
  async createTransport(){
    if(process.env.NODE_ENV == "production"){
      
      return this.transporter = nodemail.createTransport(
        nodemailerSengrid({
          apiKey: process.env.SENDGRID_API_KEY}
        )
      )

    }
    this.transporter = await nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user:process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASSWORD
    }
   });
   
  }
  
  async sendEmail(template ,subject){
    
    const html = await pug.renderFile(`${__dirname}/../views/email/${template}.pug`,{
      url:this.url,
      firstName:this.firstName
    })
    
    const text = await  htmlToText(html)
    
      //define the email options 
      const emailOptions = {
      from:this.from,
      to:this.to,
      subject,
      html,
      text
      }
     await this.createTransport()

     await this.transporter.sendMail(emailOptions)

    
  }
  
  async sendWelcome(){
    await this.sendEmail('welcome','WELCOME')
  }
}














