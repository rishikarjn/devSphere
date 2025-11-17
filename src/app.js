const express=require("express");
const connectDB =require("./config/database");
const app = express();
const User =require("./models/user");


app.post("/signup",async (req, res) =>{
    const user = new User({
        firstName: "Rishika",
        lastName: "Ranjan",
        emailId: "rishikasingh2109@gmail.com",
        password: "Rishika123",
 });

 try{
     await user.save();
     res.send("User Added successfully!!");
 } catch(err) {
    res.status(400).send("Error saving the user:" + err.message);
 }
 
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



































