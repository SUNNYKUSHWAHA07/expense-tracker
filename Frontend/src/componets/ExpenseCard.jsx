import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ViewExpense() {
  const { expenseId } = useParams();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await fetch(
          `/api/expense/expenses/${expenseId}`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Failed to fetch expense");

        const data = await res.json();
        setExpense(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [expenseId]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;
  if (!expense) return null;

  return (
    <div className="max-w-md mx-auto mt-6 px-4">
      <div className="bg-white shadow-lg rounded-xl p-5 space-y-4">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{expense.description}</h2>
          <span className="text-lg font-semibold text-indigo-600">
            ₹{expense.amount}
          </span>
        </div>

        {/* Meta */}
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium">Paid By:</span>{" "}
            {expense.paidBy?.name}
          </p>
          <p>
            <span className="font-medium">Category:</span>{" "}
            {expense.category}
          </p>
          <p>
            <span className="font-medium">Split Type:</span>{" "}
            {expense.splitType}
          </p>
          <p>
            <span className="font-medium">Date:</span>{" "}
            {new Date(expense.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Split Details */}
        <div>
          <h3 className="font-semibold mb-2">Split Details</h3>
          <div className="space-y-2">
            {expense.splitDetails.map((split) => (
              <div
                key={split._id}
                className="flex justify-between bg-gray-50 p-2 rounded"
              >
                <span>{split.userId?.username}</span>
                <span className="font-medium">₹{split.amount}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
