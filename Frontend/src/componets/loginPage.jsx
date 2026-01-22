import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/authContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    try {
      setLoading(true);

      // 🔐 LOGIN API CALL
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include", // COOKIE AUTH
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }

      // 🔁 Fetch authenticated user
      const meRes = await fetch("/api/auth/me", {
        credentials: "include",
      });

      const meData = await meRes.json();
      setUser(meData.user);

      navigate("/dashboard"); // redirect after login
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-4">
          <h1 className="text-center text-white text-xl font-semibold">
            Splitwise UI
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Server Error */}
          {serverError && (
            <p className="text-sm text-red-500 text-center">
              {serverError}
            </p>
          )}

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <span onClick={()=>{navigate("/signup")}} className="text-indigo-600 cursor-pointer font-medium">
              Signup
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
