// import mongoose from "mongoose";

// const expenseSchema = new mongoose.Schema({
//   description: {
//     type: String,
//     required: true,
//     trim: true,
//   },

//   amount: {
//     type: Number,
//     required: true,
//   },

//   paidBy: {
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "User",   
//     required: true,
//   },

//   participants: [{
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "User",
//     required: true,
//   }]
    
//   ,

//   date: {
//     type: Date,
//     default: Date.now,
//   },
// });

// export default mongoose.model("Expense", expenseSchema);




import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true
  },

  category: {
    type: String,
    enum: ["food", "travel", "rent", "shopping", "other"],
    default: "other"
  },

  splitType: {
    type: String,
    enum: ["equal", "unequal", "percentage"],
    default: "equal"
  },

  splitDetails: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        
      },
      amount: {
        type: Number,
        required: true
      }
    }
  ],

  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Expense =
  mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

export default Expense;
