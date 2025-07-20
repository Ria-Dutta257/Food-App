import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import fs from 'fs';
import userRouter from "./routes/userRoute.js";
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";


const uploadPath = 'uploads';
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

//app config
const app = express()
const port=4000


//middleware
app.use(express.json())  //using this middleware whenever we will get the request from the frontend to backend that will be parsed using this json
app.use(cors())       //using this we can access the backend from any frontend

//db connection
connectDB();

//api endpoints
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)


app.get("/",(req,res)=>{
    res.send("API Working")
})    //get method is a HTTP method using that we can request the data from the server
                      
app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`);
    
})
