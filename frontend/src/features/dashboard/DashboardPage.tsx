import type React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export const DashboardPage: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <Link to="/" className="text-blue-600 underline">
        Go to Home
      </Link>
      <button onClick={logout}>Log out</button>
    </div>
  );
};
