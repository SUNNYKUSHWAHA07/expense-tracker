import Group from "../models/groupModel.js";
import Expense from "../Models/expenseModel.js";

//create groups
export const createGroup = async (req, res) => {
try{
   const { name, members } = req.body;
   
  const group = await Group.create({
    name,
    members,
    createdBy: req.user.id
  });

  res.status(201).json(group);
  }catch(err){
    console.log("error in createGroup", err);
    res.status(500).json({message: err.message});
  }


}
 
//get your groups
export const getMyGroups = async (req, res) => {
  try{
      const groups = await Group.find({
     members: req.user.id
    }).populate("members", "username email");

     res.json(groups);
  }catch(err){
    console.log("error in getMyGroup", err);
    res.status(500).json({message: err.message});
  }
 
};

//get your group exprense
export const getGroupExpenses = async (req, res) => {
    try{
        const expenses = await Expense.find({
    groupId: req.params.groupId
  })
  .populate("paidBy", "username")
  .populate("splitDetails", "username");

  res.json(expenses);
    }catch(err){
    console.log("error in getGroupExpenses", err);
    res.status(500).json({message: err.message});
    }
};

//get your group balance
export const getGroupBalances = async (req, res) => {
   try {
 const expenses = await Expense.find({
  groupId: req.params.groupId,
})
.populate("paidBy", "username")
.populate("splitDetails.userId", "username");


const balances = {};

expenses.forEach(exp => {
  const payer = exp.paidBy.username;

  if (!balances[payer]) balances[payer] = 0;

  // total expense
  const total = exp.splitDetails.reduce((s, d) => s + d.amount, 0);
  balances[payer] += total;

  exp.splitDetails.forEach(detail => {
    const user = detail.userId.username;

    if (!balances[user]) balances[user] = 0;
    balances[user] -= detail.amount;
  });
});


res.json(balances);


} catch (err) {
  res.status(500).json({ message: err.message });
}

};

//get group details
export const getGroupDetails = async (req, res) => {
  try{
      const group = await Group.findById(req.params.id)
    .populate("members", "username email");

  res.json(group)

  }catch(err){
     console.log("error in getGroupDetails", err);
    res.status(500).json({message: err.message});
  }

};

// UpdateExpense
export const updateExpense = async (req, res) => {
  try{
     const expense = await Expense.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(expense);

  }catch(err){
    console.log("error in updateExpense", err);
    res.status(500).json({message: err.message});
  }
 
};

// deleteExpense
export const deleteExpense = async (req, res) => {
  try{
     await Expense.findByIdAndDelete(req.params.id);
  res.json({ msg: "Expense deleted" });
  }catch(err){
    console.log("error in deleteExpense", err);
    res.status(500).json({message: err.message});
  }
  
};



