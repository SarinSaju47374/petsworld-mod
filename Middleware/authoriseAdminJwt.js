import jwt2 from "jsonwebtoken"
;

//Admin Verification Middleware
const authoriseAdminJwt = (req,res,next)=>{
    //cookie extraction
  let cookieHeaderValue = req.headers.cookie;
  let tokenA = null;

  if (cookieHeaderValue) {
    let cookies = cookieHeaderValue.split(";");

    for (let cookie of cookies) {
      let [cookieName, cookieValue] = cookie.trim().split("=");

      if (cookieName === "tokenA") {
        tokenA = cookieValue;
        break;
      }
    }
  }
  //cookie extraction
    if(tokenA){
         jwt2.verify(tokenA,process.env.secretKeyA,(err,user)=>{
            if(err){
                res.render("403Error")
            }else{
                next();
            }
        })
         
    }else{
        return res.redirect("/admin")
         
    }
}
export default authoriseAdminJwt;