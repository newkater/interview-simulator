import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";

interface AuthFormProps {
  title: string;
  subtitle: string;
  buttonText: string;
  loadingText: string;
  linkTitle: string;
  linkTo: string;
  linkText: string;
  isLoading: boolean;
  buttonDisabled: boolean;
  errorMessage: string | null;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  title,
  subtitle,
  buttonText,
  loadingText,
  linkTitle,
  linkTo,
  linkText,
  isLoading,
  buttonDisabled,
  errorMessage,
  onSubmit,
  children,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
      <div className="max-w-md w-full bg-slate-100 border border-slate-200 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight">{title}</h2>
          <p className="text-sm text-slate-600 mt-2">{subtitle}</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-200 text-red-900 border border-red-300 text-sm rounded-lg">
            {errorMessage}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-6">{children}</div>

          <Button
            type="submit"
            disabled={buttonDisabled}
            label={isLoading ? loadingText : buttonText}
          />
        </form>
        <p className="text-center text-sm text-slate-600 mt-8">
          {linkTitle}{" "}
          <Link
            to={linkTo}
            className="text-blue-500 hover:text-blue-600 font-semibold underline transition-colors tracking-tighter"
          >
            {linkText}
          </Link>
        </p>
      </div>
    </div>
  );
};
