
require("dotenv").config();
const express=require("express");

const app=express();

app.use(express.json());
const connectDB=require("./config/db")
connectDB();
const imageRoutes=require("./routes/imageRoutes")
app.use("/api",imageRoutes)

const PORT=1359;
app.get('/',(req,res)=>{
    res.send('Hello venkat')
})
app.listen(PORT,()=>{
    console.log(`server is runing on ${PORT}`)
})