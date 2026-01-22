import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

export default function GroupDetails() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [expandedExpenses, setExpandedExpenses] = useState({});
  const [showMembers, setShowMembers] = useState(true);
  const [showExpenses, setShowExpenses] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const groupRes = await fetch(
          `/api/groups/${groupId}`,
          { credentials: "include" }
        );

        if (!groupRes.ok) throw new Error("Group not found");
        const groupData = await groupRes.json();
        setGroup(groupData);

        const expenseRes = await fetch(
          `/api/expense/expenses/group/${groupId}`,
          { credentials: "include" }
        );

        if (expenseRes.ok) {
          const expenseData = await expenseRes.json();
          setExpenses(expenseData);
        } else {
          setExpenses([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId]);

  const toggleExpense = (id) => {
    setExpandedExpenses((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDelete = async (expenseId) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      const res = await fetch(
        `/api/expense/${expenseId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      setExpenses((prev) =>
        prev.filter((e) => e._id !== expenseId)
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!group)
    return <div className="text-center mt-10">Group not available</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg">

        {/* Header */}
        <div className="bg-indigo-600 text-white p-4 text-lg font-semibold text-center">
          Group Details
        </div>

        <div className="p-4 space-y-5">

          {/* Group Name */}
          <h2 className="text-xl font-bold text-center">
            {group.name}
          </h2>

          {/* Members */}
          <div className="border rounded-lg">
            <button
              onClick={() => setShowMembers(!showMembers)}
              className="w-full p-3 flex justify-between bg-gray-50"
            >
              Members ({group.members.length})
              {showMembers ? <ChevronUp /> : <ChevronDown />}
            </button>

            {showMembers && (
              <div className="p-3 flex flex-wrap gap-2">
                {group.members.map((m) => (
                  <span
                    key={m._id}
                    className="px-3 py-1 text-sm bg-indigo-100 rounded-full"
                  >
                    {m.username || m.name || m.email}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Expenses Header */}
          <div className="border rounded-lg">
            <div className="flex justify-between items-center p-3 bg-gray-50">
              <button onClick={() => setShowExpenses(!showExpenses)}>
                Expenses ({expenses.length})
              </button>

              <div className="flex gap-5">
                 <button
                onClick={() => navigate(`/groups/${groupId}/balances`)}
                className="bg-indigo-600 text-white px-3 py-1 rounded"
              >
                Total
              </button>

              <button
                onClick={() => navigate(`/groups/${groupId}/add`)}
                className="bg-indigo-600 text-white px-3 py-1 rounded"
              >
                + Add
              </button>
              </div>
             
            </div>
          </div>

          {/* Expenses List */}
          {showExpenses && (
            <div className="space-y-3">
              {expenses.length === 0 && (
                <p className="text-center text-gray-500">
                  No expenses added yet
                </p>
              )}

              {expenses.map((expense) => (
                <div key={expense._id} className="border rounded-lg">
                  <button
                    onClick={() => toggleExpense(expense._id)}
                    className="w-full p-3 flex justify-between"
                  >
                    <div>
                      <p className="font-semibold">{expense.description}</p>
                      <p className="text-sm text-gray-500">
                        Paid by {expense.paidBy?.username || expense.paidBy?.username}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      ₹{expense.amount}
                      {expandedExpenses[expense._id] ? <ChevronUp /> : <ChevronDown />}
                    </div>
                  </button>

                  {expandedExpenses[expense._id] && (
                    <div className="p-3 bg-indigo-50 space-y-2 text-sm">

                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() =>
                            navigate(`/expenses/${expense._id}`)
                          }
                          className="px-3 py-1 bg-gray-200 rounded"
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/expenses/${expense._id}/edit`)
                          }
                          className="px-3 py-1 bg-yellow-400 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(expense._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded"
                        >
                          Delete
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

           <button
            onClick={() => navigate(-1)}
            className="w-full  bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-lg font-medium"
          >
            Back
          </button>

        </div>
        
      </div>
      
    </div>
  );
}
