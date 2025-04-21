const jwt=require('jsonwebtoken');

function tokenAuth(req,res,next){
    if(req.headers.authorization!==undefined){
        const token =req.headers.authorization.split(" ")[1];
        jwt.verify(token, "ohHappyDay#15",(err, token)=>{
            if(!err){
                next();
            }
            else{
                res.status(403).send("Invalid credentials, please login again");
            }
        });
    }
    else{
        res.send("No token found")
    }
}

module.exports=tokenAuth