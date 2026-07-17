import type React from "react";
import { Link } from "react-router-dom";

export const RegisterPage: React.FC = () => {
  return (
    <div>
      <h1>Register</h1>
      <Link to="/" className="text-blue-600 underline">
        Go to Home
      </Link>
    </div>
  );
};
