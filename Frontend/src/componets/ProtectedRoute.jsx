import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/authContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? children : <Navigate to="/" />;
}
