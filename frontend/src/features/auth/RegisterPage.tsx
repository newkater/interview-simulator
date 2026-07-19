import type React from "react";
import { AuthForm } from "./AuthForm";
import { InputField } from "../../components/ui/InputField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "./useAuthMutations";

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const { mutate, isPending, error } = useRegisterMutation();

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
    <AuthForm
      title="Create Account"
      subtitle="Sign up to practice your interviews!"
      buttonText="Sign up"
      loadingText="Creating your account..."
      linkTitle="Already have an account?"
      linkTo="/login"
      linkText="Sign in here"
      isLoading={isPending}
      buttonDisabled={isPending || password != confirmPassword || !password}
      errorMessage={error?.response?.data?.title || null}
      onSubmit={handleSubmit}
    >
      <InputField
        label="Email Address"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />

      <InputField
        label="Password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
      />

      <InputField
        label="Confirm Password"
        type="password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="••••••••"
      />
    </AuthForm>
  );
};
