import jwt from "jsonwebtoken"

//User Verification Middleware
const authoriseJwt = (req,res,next)=>{
  console.log("Inside  Middleware")
    //cookie extraction
  let cookieHeaderValue = req.headers.cookie;
  let token = null;

  if (cookieHeaderValue) {
    let cookies = cookieHeaderValue.split(";");

    for (let cookie of cookies) {
      let [cookieName, cookieValue] = cookie.trim().split("=");

      if (cookieName === "token") {
        token = cookieValue;
        break;
      }
    }
  }
  //cookie extraction
    if(token){

         jwt.verify(token,process.env.secretKeyU,(err,user)=>{
            if(err){
                res.render("403Error")
            }else{
              console.log("Token is valid")
                next();
            }
        })
         
    }else{
      console.log("Token aint Valid")
        return res.redirect("/login");
        
    }
}

export default authoriseJwt;