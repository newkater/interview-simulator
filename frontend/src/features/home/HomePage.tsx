import type React from "react";
import { Link } from "react-router-dom";

export const HomePage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">
        🎙️ AI Interview Prep Simulator
      </h1>
      <p className="mb-4">
        Welcome! Practice your engineering interviews with real-time AI
        feedback.
      </p>
      <div className="flex gap-4">
        <Link to="/login" className="text-blue-600 underline">
          Go to Login
        </Link>
        <Link to="/register" className="text-blue-600 underline">
          Go to Register
        </Link>
        <Link to="/dashboard" className="text-blue-600 underline">
          Go to Dashboard (Unprotected for now)
        </Link>
      </div>
    </div>
  );
};
