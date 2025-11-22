const jwt =require("jsonwebtoken");
const User =require("../models/user.js");


const userAuth=async (req,res,next)=>{
try{
    const {token}=req.cookies;
    if(!token){
        throw new Error("Token is not valid!!!");
    }
    const decodeObj =await jwt.verify(token,"DEV@Sphere$647");
    const {_id} =decodeObj;

    const user=await User.findById(_id)
    if(!user){
        throw new Error("User not found");
    }
    next();
} catch(err){
    res.status(400).send("ERROR:"+err.message);
}
  //Read the token from the req cookies
};

module.exports ={
    // adminAuth,
    userAuth,
};