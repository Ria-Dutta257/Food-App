import express from "express"
import { addFood,listFood ,removeFood} from "../controllers/foodController.js"
import multer from "multer" //using this we will create the image storage system

const foodRouter = express.Router();   //using this router we can create the get method ,post method etc.

//Image Storage Engine , we will create one storage using the multer disk storage method.

const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})    //using this we can store the image in the upload folder

foodRouter.post("/add",upload.single('image'),addFood)  //here we used this middleware to upload the image that we have created using the multer package
foodRouter.get("/list",listFood)
foodRouter.post("/remove",removeFood)

export default foodRouter;                            