export const splitExpense = (expenses) => {
     const balances = {};

    // 🔹 Equal split + balance calculation
    expenses.forEach(exp => {
      const { amount, paidBy, participants } = exp;
       
      
      if (!participants || participants.length === 0) return;
      
      const share = Number(amount) / participants.length;
      
      // init users
      participants.forEach(user => {
        if (!balances[user]) balances[user] = 0;
      });

      // paid person gets full amount
     if (!balances[paidBy]) balances[paidBy] = 0;
        balances[paidBy] += Number(amount);

      // everyone pays equal share
      participants.forEach(user => {
        balances[user] -= Number(share);
      });
    });

    

    // 🔹 Settlement logic (who owes whom)
    const debtors = [];
    const creditors = [];

    Object.entries(balances).forEach(([user, amount]) => {
      if (amount < 0) debtors.push({ user, amount: -amount });
      if (amount > 0) creditors.push({ user, amount });
    });

    const settlements = [];
    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
      const pay = Math.min(debtors[i].amount, creditors[j].amount);

      settlements.push({
        from: debtors[i].user,
        to: creditors[j].user,
        amount: pay,
      });

      debtors[i].amount -= pay;
      creditors[j].amount -= pay;

      if (debtors[i].amount === 0) i++;
      if (creditors[j].amount === 0) j++;
    }
  return { balances, settlements };
}


