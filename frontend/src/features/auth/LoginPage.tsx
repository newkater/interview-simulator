import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "./useAuthMutations";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useLoginMutation();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      { email, password },
      {
        onSuccess: () => navigate("/dashboard"),
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
      <div className="max-w-md w-full bg-slate-100 border border-slate-200 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Sign in to practice your interviews!
          </p>
        </div>

        {isError && (
          <div className="mb-6 p-4 bg-red-200 text-red-900 border border-red-300 text-sm rounded-lg">
            {error?.response?.data?.title ||
              "Invalid email or password. Please try again."}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-800 font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-slate-200 border border-slate-300 rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-slate-800 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-200 border border-slate-300 rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-blue-300 hover:bg-blue-400 font-semibold rounded-lg shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {isPending ? "Signing you in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-8">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:text-blue-600 font-semibold underline transition-colors tracking-tighter">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};
