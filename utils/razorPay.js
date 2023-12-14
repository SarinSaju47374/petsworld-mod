import Razorpay from "razorpay";
import crypto from "crypto";
var instance = new Razorpay({ key_id: 'rzp_test_L8GMgCporQgX4T', key_secret: 's1Hyk3keOUC1KRVXctDvYnzs' })

let genrateRazorPay = (amount)=>{
    // console.log(amount+"😀😀😀😀😀😀😀");
    return new Promise((resolve,reject)=>{
        var options = {
            amount: Number(amount),  
            currency: "INR",
            receipt: "order_rcptid_11",
          };
          instance.orders.create(options, function(err, order) {
            if(err){
                console.log(err)
            }else{
                resolve(order)
            }
          });
    })
     
}
let verifyRazrPymnt = (details)=>{
    return new Promise((resolve,reject)=>{
        let hmac = crypto.createHmac('sha256',process.env.RAZOR_SECRET);
        hmac.update(details.response['razorpay_order_id']+'|'+details.response['razorpay_payment_id']);
        hmac = hmac.digest('hex');
        if(hmac==details.response['razorpay_signature']){
            resolve()
        }else{
            reject();
        }
    })
}
export {genrateRazorPay,verifyRazrPymnt};