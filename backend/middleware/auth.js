//If user will send the item id using that id we can add one entry in their cart.
// When user will send the data they will use the token to authenticate them.
// To decode the token we will use this middleware.
import jwt from "jsonwebtoken"

const authMiddleware = async (req,res,next) => {
    const {token} = req.headers;
    if(!token){
        return res.json({success:false,message:"Not Authorized Login Again"})
    }
    try {
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }

}

export default authMiddleware; 