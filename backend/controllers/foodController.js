//We will create one controller function to add food item using this we will create one route.
import foodModel from "../models/foodModel.js";
import fs from 'fs'


//add food item

const addFood = async (req,res) => {    //we will create the logic using which we can store the product data in the database.
    console.log("Uploaded file:", req.file);
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No image uploaded" });
    }
    let image_filename = `${req.file.filename}` //using this we will store the uploaded filename in this variable

    const food = new foodModel({
        name: req.body.name,                     //whenever we will hit the API addFood in the body we send these details and we will access this in the backend using this function
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    })
    try {
        await food.save();
        res.json({success:true,message:"Food Added"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//all food list
const listFood = async(req,res) => {
    try {
        const foods = await foodModel.find({})
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//remove food-item
const removeFood = async(req,res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{}) 

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Food Remved"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export {addFood,listFood,removeFood}