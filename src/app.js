const express=require("express");
const connectDB =require("./config/database");
const app = express();
const cookieParser =require("cookie-parser");
const cors=require("cors");

app.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin',"http://localhost:5173");
  next();
})

app.use(
  cors({
      origin: "http://localhost:5173",
  
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Add PATCH here
    allowedHeaders: ["Content-Type", "Authorization"],
   
  })
);

// app.options("/*", cors());
app.use(express.json());
app.use(cookieParser());


const authRouter =require("./routes/auth");
const profileRouter =require("./routes/profile");
const requestRouter =require("./routes/request");
const userRouter =require("./routes/user");
const { set } = require("mongoose");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);


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

































