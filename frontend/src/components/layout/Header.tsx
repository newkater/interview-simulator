import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";

export const Header: React.FC = () => {
  const { logout, user } = useAuth();

  return (
    <header className="bg-blue-100 border-b border-slate-300 text-slate-900 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center max-w-7xl px-4 sm:px-6 lg:px-8 h-16">
        <Link
          to="/dashboard"
          className="text-slate-900 hover:text-slate-700 transition-colors flex items-center space-x-2 font-bold text-xl"
        >
          <span>Interview Simulator</span>
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="mr-4 text-sm">Welcome, {user}!</span>
              <Link
                to="/interviews/new"
                className="text-sm sm:inline-block text-slate-900 hover:text-slate-700 transition-colors"
              >
                + New Interview
              </Link>
              <button
                onClick={logout}
                className="cursor-pointer text-sm sm:inline-block text-slate-900 hover:text-slate-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-slate-900 hover:text-slate-700 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
