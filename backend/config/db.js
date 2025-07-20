import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://riadutta:riadutta12345@cluster0.ivb01s2.mongodb.net/foodapp')
    .then(() => console.log("DB Connected"));
}