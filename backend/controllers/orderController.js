import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js'
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


//placing user order for frontend
const placeOrder = async(req,res) => {

    const frontend_url = "http://localhost:5174"

    try {
        const newOrder = new orderModel({
            userId : req.body.userId,
            items : req.body.items,
            amount : req.body.amount,
            address : req.body.address
        })
        await newOrder.save();    //it will save the order in our database.
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});      //When the user will place the order after that we have to clear the user cart  

        const line_items = req.body.items.map((item)=>({
          price_data:{
            currency:"inr",
            product_data:{
                name:item.name
            },
            unit_amount:item.price*100*80
          },
          quantity:item.quantity   
        }))

        //pushing the delivery charges in the line_items.
        line_items.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount: 2*100*80
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })

        res.json({success:true,session_url:session.url})

    } catch (error) {
      console.log(error);
      res.json({success:false,message:"Error"})
    }
}

const verifyOrder = async (req,res) => {
     const {orderId,success} = req.body ;
     try {
        if(success=="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"Paid"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"})
        }
     } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
     }
}

//users order for frontend
const userOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId}) ;  //finding all orders of that user
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//Listing orders for admin panel
const listOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({});  //using this we will get all the orders data in this variable
        res.json({success:true,data:orders})       //now using the API we have to send this
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//api for updating order status
const updateStatus = async (req,res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}