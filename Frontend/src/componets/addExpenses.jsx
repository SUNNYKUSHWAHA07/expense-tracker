import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AddExpense() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const CATEGORIES = ["food", "travel", "rent", "shopping", "other"];
  const SPLIT_TYPES = ["equal", "unequal", "percentage"];

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "",
    splitType: "equal",
  });

  const [participants, setParticipants] = useState([]);

  /* ---------------- FETCH USERS + ME ---------------- */
  useEffect(() => {
    const load = async () => {
      const [uRes, meRes] = await Promise.all([
        fetch("/api/users", { credentials: "include" }),
        fetch("/api/auth/me", { credentials: "include" }),
      ]);

      const usersData = await uRes.json();
      const meData = await meRes.json();

      setUsers(usersData);
      setCurrentUser(meData.user);

      // self added by default
      setParticipants([{ userId: meData.user._id, value: "" }]);
    };

    load();
  }, []);

  /* ---------------- PARTICIPANTS ---------------- */
  const toggleParticipant = (user) => {
    if (user._id === currentUser?._id) return;

    const exists = participants.find((p) => p.userId === user._id);

    if (exists) {
      setParticipants(participants.filter((p) => p.userId !== user._id));
    } else {
      setParticipants([...participants, { userId: user._id, value: "" }]);
    }
  };

  const updateValue = (userId, value) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.userId === userId ? { ...p, value } : p
      )
    );
  };

  /* ---------------- SPLIT LOGIC ---------------- */
  const buildSplitDetails = () => {
    const total = Number(form.amount);

    if (form.splitType === "equal") {
      const perHead = +(total / participants.length).toFixed(2);
      return participants.map((p) => ({
        userId: p.userId,
        amount: perHead,
      }));
    }

    if (form.splitType === "percentage") {
      return participants.map((p) => ({
        userId: p.userId,
        amount: +(total * (Number(p.value) / 100)).toFixed(2),
      }));
    }

    // unequal
    return participants.map((p) => ({
      userId: p.userId,
      amount: Number(p.value),
    }));
  };

  const validate = () => {
    if (!form.description || !form.amount || !form.category) return false;

    const total = Number(form.amount);

    if (form.splitType === "unequal") {
      const sum = participants.reduce(
        (s, p) => s + Number(p.value || 0),
        0
      );
      return sum === total;
    }

    if (form.splitType === "percentage") {
      const percent = participants.reduce(
        (s, p) => s + Number(p.value || 0),
        0
      );
      return percent === 100;
    }

    return participants.length > 0;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      alert("Split validation failed");
      return;
    }

    const payload = {
      description: form.description,
      amount: Number(form.amount),
      groupId,
      category: form.category,
      paidBy: currentUser._id,
      splitType: form.splitType,
      splitDetails: buildSplitDetails(),
    };

    const res = await fetch("/api/expense", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Failed to add expense");
      return;
    }

    navigate(`/groups/${groupId}`);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow">
        <div className="bg-indigo-600 text-white py-4 text-center text-xl">
          Add Expense
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            placeholder="Description"
            onChange={(v) => setForm({ ...form, description: v })}
          />

          <Input
            type="number"
            placeholder="Total Amount"
            onChange={(v) => setForm({ ...form, amount: v })}
          />

          {/* CATEGORY */}
          <select
            className="w-full border p-2 rounded"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* SPLIT TYPE */}
          <select
            className="w-full border p-2 rounded"
            value={form.splitType}
            onChange={(e) =>
              setForm({ ...form, splitType: e.target.value })
            }
          >
            {SPLIT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* PARTICIPANTS */}
          <div>
            <h3 className="font-semibold mb-2">Participants</h3>
            <div className="grid grid-cols-2 gap-2">
              {users.map((u) => (
                <button
                  type="button"
                  key={u._id}
                  onClick={() => toggleParticipant(u)}
                  className={`border p-2 rounded ${
                    participants.some((p) => p.userId === u._id)
                      ? "bg-indigo-600 text-white"
                      : ""
                  }`}
                >
                  {u.username || u.name}
                  {u._id === currentUser?._id && " (You)"}
                </button>
              ))}
            </div>
          </div>

          {/* SPLIT INPUTS */}
          {form.splitType !== "equal" && (
            <div className="space-y-2">
              {participants.map((p) => {
                const u = users.find((x) => x._id === p.userId);
                return (
                  <div key={p.userId} className="flex justify-between">
                    <span>{u?.username || u?.name}</span>
                    <input
                      type="number"
                      placeholder={form.splitType === "percentage" ? "%" : "Amount"}
                      className="w-28 border px-2 rounded"
                      onChange={(e) =>
                        updateValue(p.userId, e.target.value)
                      }
                    />
                  </div>
                );
              })}
            </div>
          )}

          <button className="w-full bg-indigo-600 text-white py-2 rounded">
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------------- INPUT ---------------- */
function Input({ type = "text", placeholder, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border px-3 py-2 rounded"
    />
  );
}
