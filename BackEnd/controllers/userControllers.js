import userModel from "../Models/userModel.js"

// getAllUsers
export const getAllUsers = async(req,res) =>{
    try{
    const users = await userModel.find().select(-"password")
    res.status(200).json(users)
    }catch(err){
     console.log(err);
    }
}