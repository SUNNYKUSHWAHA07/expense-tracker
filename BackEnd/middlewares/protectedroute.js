import jwt from "jsonwebtoken";
import userModel from "../Models/userModel.js";

const protectedRoute = async (req, res, next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message: "Unauthorized, no token"});
        }

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

     //finding user
        req.user = await userModel.findById(decoded.id).select("-password");

        if(!req.user){
              return res.status(401).json({
              message: "User not found",
      });
        }
        next();

        
    }catch(err){
        console.log("err in protected route", err);
        res.status(500).json({message: "Server Error"})
    }
}

export default protectedRoute;