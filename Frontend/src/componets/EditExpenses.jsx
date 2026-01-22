import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditExpense() {
  const { expenseId } = useParams();
  const navigate = useNavigate();

  const CATEGORIES = ["food", "travel", "rent", "shopping", "other"];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "",
    splitType: "unequal",
  });

  const [participants, setParticipants] = useState([]);

  // 🔹 Fetch existing expense
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await fetch(
          `/api/expense/expenses/${expenseId}`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Failed to load expense");

        const data = await res.json();
        console.log(data);
        
        setForm({
          description: data.description,
          amount: data.amount,
          category: data.category,
          splitType: data.splitType || "unequal",
        });

        setParticipants(
          data.splitDetails.map((s) => ({
            userId: s.userId._id || s.userId,
            amount: s.amount,
            name: s.userId.username || s.userId.name || s.userId.email,
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [expenseId]);

  const updateAmount = (userId, value) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.userId === userId ? { ...p, amount: value } : p
      )
    );
  };

  const validate = () => {
    const total = participants.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );
    return (
      form.description &&
      form.amount &&
      form.category &&
      total === Number(form.amount)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      alert("Validation failed or split mismatch");
      return;
    }

    const payload = {
      description: form.description,
      amount: Number(form.amount),
      category: form.category,
      splitType: form.splitType,
      splitDetails: participants.map((p) => ({
        userId: p.userId,
        amount: Number(p.amount),
      })),
    };

    try {
      const res = await fetch(
        `/api/expense/expenses/${expenseId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      alert("Expense updated successfully");
      navigate(-1); // back to group
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return <div className="text-center mt-10">Loading...</div>;

  if (error)
    return (
      <div className="text-center mt-10 text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-4 text-center text-white text-xl">
          Edit Expense
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Description */}
          <input
            type="text"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="Description"
            className="w-full border px-4 py-2 rounded"
          />

          {/* Amount */}
          <input
            type="number"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
            placeholder="Total Amount"
            className="w-full border px-4 py-2 rounded"
          />

          {/* Category */}
          <select
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Split Amounts */}
          <div className="space-y-3">
            <h3 className="font-semibold">Split Details</h3>

            {participants.map((p) => (
              <div
                key={p.userId}
                className="flex justify-between items-center"
              >
                <span>{p.name}</span>
                <input
                  type="number"
                  value={p.amount}
                  onChange={(e) =>
                    updateAmount(p.userId, e.target.value)
                  }
                  className="w-32 border px-3 py-1 rounded"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-lg"
          >
            Update Expense
          </button>
        </form>
      </div>
    </div>
  );
}
