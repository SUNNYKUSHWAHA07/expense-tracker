
import expenseModel from "../Models/expenseModel.js";
import { splitExpense } from "../utils/spilter.js";

//get All expenses
export const getAllExpenses = async(req, res, next) => {
  try{
  console.log(req.user._id);

   const expenses = await expenseModel.find();
  res.json(expenses);

  }catch(err){
    console.log("error in get", err);
    res.status(500).json({message: err.message});
    next(err)
  }
  
}

//create expenses
export const createExpense = async(req, res, next) => {

  try{
    const { description, amount, paidBy, groupId, category, splitType, splitDetails,} = req.body;
    
  if (!description || !amount || !paidBy || !groupId || !category || !splitType || !splitDetails  ) {
    return res.status(400).send("All fields are required");
  }

  const expense = new expenseModel({
    description,
    amount,
    paidBy:req.user._id,
    groupId,
    category,
    splitType,
    splitDetails,
  });

  
  await expense.save();
  res.status(201).send("Expense post created");
  console.log("created")

  }catch(err){
    console.log("error in post", err);
    res.status(500).json({message: err.message});
    next(err)
  }
  
}

// remove expenses
export const removeExpense = async(req, res, next) => {
    try{
      const { id } = req.params;
    await expenseModel.findByIdAndDelete(id);
    res.send("Expense post deleted");
    }catch(err){
      console.log("error in delete", err);
      res.status(500).json({message: err.message});
      next(err)
    }
}

//get Expenses By Id
export const getExpenseById = async(req,res) =>{
  try{
    
   const expense = await expenseModel.findById(req.params.id)
      .populate("paidBy", "name email")
      .populate("groupId", "name")
      .populate({
        path: "splitDetails.userId",
        select: "username email",
      });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(expense)

  }catch(err){
     console.log("error in getexpensis by id", err);
    res.status(500).json({message: err.message});
  }
}

//spliting Logic
export const splitExpenses = async(req, res, next) => {
   try{
     const expense = await expenseModel.find()
     const { balances, settlements } = splitExpense(expense);
    res.status(200).json({
      success: true,
      balances,
      settlements,
    });

  }catch(err){
    console.log("error in split", err);
    res.status(500).json({message: err.message});
  }
}
