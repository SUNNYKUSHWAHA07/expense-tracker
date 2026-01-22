import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!form.username.trim())
      newErrors.username = "Username is required";

    if (!form.email)
      newErrors.email = "Email is required";

    if (!form.password || form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // cookie-based auth
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      setUser(data.user);
      navigate("/dashboard");
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden">

        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-4">
          <h1 className="text-center text-white text-xl font-semibold">
            Signup
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <input
              placeholder="Username"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.username && (
              <p className="text-sm text-red-500 mt-1">
                {errors.username}
              </p>
            )}
          </div>

          <div>
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg"
          >
            {loading ? "Creating..." : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
}
