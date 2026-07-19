import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "./useAuthMutations";
import { InputField } from "../../components/ui/InputField";
import { AuthForm } from "./AuthForm";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { mutate, isPending, error } = useLoginMutation();

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
      title="Welcome Back"
      subtitle="Sign in to practice your interviews!"
      buttonText="Sign in"
      loadingText="Signing you in..."
      linkTitle="Don't have an account?"
      linkTo="/register"
      linkText="Sign up here"
      isLoading={isPending}
      buttonDisabled={isPending || !password}
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
    </AuthForm>
  );
};
