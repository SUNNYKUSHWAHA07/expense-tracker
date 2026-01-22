import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Balances() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const res = await fetch(
          `/api/balances/group/${groupId}`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Failed to fetch balances");

        const data = await res.json();

        // Convert object → settlement list
        const creditors = [];
        const debtors = [];

        Object.entries(data).forEach(([user, amount]) => {
          if (amount > 0) creditors.push({ user, amount });
          if (amount < 0) debtors.push({ user, amount: Math.abs(amount) });
        });

        const settlements = [];

        let i = 0,
          j = 0;

        while (i < debtors.length && j < creditors.length) {
          const pay = Math.min(debtors[i].amount, creditors[j].amount);

          settlements.push({
            from: debtors[i].user,
            to: creditors[j].user,
            amount: `₹ ${pay}`,
          });

          debtors[i].amount -= pay;
          creditors[j].amount -= pay;

          if (debtors[i].amount === 0) i++;
          if (creditors[j].amount === 0) j++;
        }

        setBalances(settlements);
      } catch (err) {
        setError(err.message || "Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [groupId]);

  // LOADING STATE
  if (loading)
    return <div className="text-center mt-10">Loading balances...</div>;

  // ERROR STATE
  if (error)
    return <div className="text-center mt-10 text-red-600">{error}</div>;

  
   
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        
        {/* HEADER SECTION */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-4">
          <h1 className="text-center text-white text-xl font-semibold">
            Group Balances
          </h1>
        </div>

        {/* CONTENT SECTION */}
        <div className="p-5">
          <h2 className="text-lg font-semibold mb-4">Who owes whom</h2>

          {/* NO SETTLEMENTS MESSAGE - All debts are settled */}
          {balances.length === 0 && (
            <p className="text-center text-gray-500">
              All balances are settled 🎉
            </p>
          )}

          {/* SETTLEMENTS LIST - Display all payment transactions */}
          <div className="space-y-4 mb-6">
            {balances.map((item, index) => (
              <div
                key={index}
                className="border rounded-xl p-4"
              >
                {/* Who pays */}
                <p className="font-medium text-gray-800">
                  {item.from} owes
                </p>
                {/* Who receives and how much */}
                <p className="text-gray-600">
                  {item.to} {item.amount}
                </p>
              </div>
            ))}
          </div>

          {/* BACK BUTTON - Navigate to previous page */}
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-lg font-medium"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
