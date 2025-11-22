const express=require("express");
const connectDB =require("./config/database");
const app = express();
const User =require("./models/user.js");
const { validateSignUpData} =require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser =require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());
app.post("/signup",async (req, res) =>{

    try{

        //Validation of data
        validateSignUpData(req);
         
        const {firstName, lastName, emailId,password} =req.body; 

        //Encrypt the password
        const passwordHash= await bcrypt.hash(password, 10);
        console.log(passwordHash);

       
        //Creating a new instance of the User
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

       await user.save();
       res.send("User Added Successfully!");

    }catch (err){
        res.status(400).send("Error savingthe user:" +err.message);
    }
});

app.post("/login",async(req,res) =>{
    try{
        const{emailId, password}=req.body;

        const user = await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }
       
        const isPasswordValid= await bcrypt.compare(password);
        
        if(isPasswordValid){

            //Create a JWT Token
            const token = await jwt.sign({_id:user._id}, "DEV@Sphere$647",{expiresIn: "1h"});

            //Add the token to cookies ans send the response back to the user
            res.cookie("token",token,{ expires:new Date(Date.now() + 8 * 36000),

            });
            res.send("Login Successful!!!")
        } else { 
    throw new Error("Invalid Credentials")
     }
    }catch (err){
        res.status(400).send("ERROR:"+err.message);
    }
});

app.get("/profile",userAuth, async (req,res) =>{
    try{
        const cookies=req.cookies;

        const {token}=cookies;
        if(!token){
            throw new Error("Invalid Token");
        }
        const decodeMessage = await jwt.verify(token, "DEV@Sphere$647");
        
        const {_id}=decodeMessage;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User does not exist");
        }
        res.send(user);
    } catch(err){
        res.status(400).send("ERROR:"+err.message);
    }
});


app.post("/sendConnectRequest", userAuth, async (req,res)=>{
      //Sending a connection request
      console.log("SEnding a connection request");
      res.send(user.firstName + " sent the connection request!");
});


connectDB()
.then(()=>{
    console.log("Database connection established...");
    app.listen(7777, () =>{
        console.log("Server is successfully listening on port 7777...");
    });
})
.catch((err) =>{
    console.log("Database cannot be connected",err);
});

































