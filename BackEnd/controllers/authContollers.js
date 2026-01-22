import userModel from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//user creation
export const createUser = async(req, res, next) => {
  
    try{
        const {username, email, password} = req.body;

        
        if(!username || !email || !password){
            return res.status(400).json({message: "Please enter all fields"});
        }

        const existingUser = await userModel.findOne({email});

      
        
        if(existingUser) {
             return res.status(400).json({ message: "User already exists" });
        }


           //hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            //new user creation
            const user = await userModel.create({
                username, 
                email,
                password: hashedPassword,
            });

            
            //token creation
             const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRES_IN});
            // setting token in cookies
             res.cookie("token", token, {
                     httpOnly: true,
                     secure: false,
                     sameSite: "strict",
                     maxAge: 7 * 24 * 60 * 60 * 1000
                   });
                   

              return res.status(201).json({
                success: true,
                message: "User registered successfully",
                user:{
                    id: user._id,
                    username: user.username,
                    email: user.email,
                }
            });


           
      
    }catch(err){
        console.log("err in register", err);
        res.status(500).json({message: "Server Error"})
        next(err)
    }

}

//login user
export const loginUser = async(req, res, next)=>{
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({message: "Please enter all fields"});
        }

        const user = await userModel.findOne({email});

        if(!user){
            return res.status(400).json({message: "User does not exist"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRES_IN});

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
          });

          return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
            }
        });

    }catch(err){
        console.log("err in login", err);
        res.status(500).json({message: "Server Error"})
    }
}

//authenticated user
export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error in getme" });
  }
};