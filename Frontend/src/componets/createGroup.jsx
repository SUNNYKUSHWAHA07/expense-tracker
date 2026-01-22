import { useEffect, useState } from "react";

export default function CreateGroup({ currentUserId }) {
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([currentUserId]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/Users", {
          credentials: "include",
        });

        if (!res.ok) {
          alert("Failed to fetch users");
          return;
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        alert("Server error while fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 🔹 Select / Unselect members
  const toggleMember = (userId) => {
    if (userId === currentUserId) return;

    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // 🔹 Submit group to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      alert("Group name is required");
      return;
    }

    if (selectedMembers.length < 2) {
      alert("Select at least one member");
      return;
    }

    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔐 auth cookie
        body: JSON.stringify({
          name: groupName,
          members: selectedMembers,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create group");
        return;
      }

      alert("Group created successfully");

      // reset
      setGroupName("");
      setSelectedMembers([currentUserId]);
    } catch (err) {
      alert("Server error while creating group");
    }
  };

  if (loading) {
    return <div className="text-center mt-10 font-medium">Loading users...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white rounded-xl shadow p-4 space-y-4"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg p-3 text-center text-xl font-semibold">
        Create Group
      </div>

      {/* Group Name */}
      <input
        type="text"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      {/* Members */}
      <div>
        <p className="font-medium mb-2">Members</p>

        <div className="max-h-48 overflow-y-auto border rounded p-2 space-y-2">
          {users.map((user) => (
            <label
              key={user._id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedMembers.includes(user._id)}
                onChange={() => toggleMember(user._id)}
                disabled={user._id === currentUserId}
              />

              <span className="text-sm">
                {user.username}
                {user._id === currentUserId && " (You)"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
      >
        Create
      </button>
    </form>
  );
}
