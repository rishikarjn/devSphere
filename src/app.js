const express=require("express");
const connectDB =require("./config/database");
const app = express();
const User =require("./models/user");

app.use(express.json());
app.post("/signup",async (req, res) =>{
    const user = new User(req.body);

    try{
       await user.save();
       res.send("User Added Successfully!");

    }catch (err){
        res.status(400).send("Error savingthe user:" +err.message);
    }
});


//Get userby email
app.get("/user", async (req,res)=>{
    const userEmail =req.body.emailId;

    try{
        const users=await User.find({emailId:userEmail});
          if(users.length ==0){
            res.status(404).send("User not found");
          }else{
            res.send(users);
          }
    } catch(err){
        res.status(400).send("Something went wrong");
    
    }
});



//Feed API -GET/ feed -get all users from the database
app.get("/feed", async(req,res)=>{
    try{
        const users=await User.find({});
        res.send(users);
    } catch (err){
        res.status(400).send("Something went wrong");
    }
});


//Delete a user from the database
app.delete("/user", async (req,res) =>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete({_id:userId});
        res.send("User deleted Successfully");
    }catch (err){
        res.status(400).send("Something went wrong");
    }
});



//Update data of the user
app.patch("/user/userId", async (req,res) =>{
    const userId =req.params?.userId;
    const data =req.body;

    try{
         const ALLOWED_UPDATES =["photoUrl","about","gender","age","skkills"];
         const isUpdateAllowed =Object.keys(data).every((k) =>
        ALLOWED_UPDATES.includes(k)
        );
        if (!isUpdateAllowed){
            throw new Error ("Update not allowed");
        }
        if(data?.skills.length >10){
            throw new Error ("Skills cannot be more than 10");
        }

         const user = await User.findByIdAndUpdate({_id: userId}, data, {
            returnDocument:"after",
            runValidators: true,
        });
        console.log(user);
        res.send("User updated successfully");
    } catch (err){
        res.status(400).send("UPDATE FAILED:" +err.message);
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

































