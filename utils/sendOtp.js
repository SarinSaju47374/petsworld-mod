import twilio from 'twilio';
export default async function(num,otp){
    const accountSid = process.env.ACC_SID;
    const authToken = process.env.AUTH_TK;
    const client = twilio(accountSid, authToken);
    client.messages
    .create({
        body: ` Your OTP is ${otp}`,
        to:  `+91${Number(num)}`, // Text your number
        from: process.env.TW_NUM, // From a valid Twilio number
    })
    .then((message) => {
        console.log("Message is Succesfully Sent to the Given Number");
        return true;
    //   res.render("otpLogin",{admin:false,user:false,otp:randomNumber,number:req.body.emailMob})
    });
}