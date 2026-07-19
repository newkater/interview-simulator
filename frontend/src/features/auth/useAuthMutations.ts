import { useMutation } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";
import api from "../../api/api";
import type { AuthResponse as LoginResponse } from "./types";

export const useLoginMutation = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (credentials: Record<string, string>) => {
      const response = await api.post<LoginResponse>(
        "/auth/login",
        credentials,
      );
      return response.data;
    },

    onSuccess: (data, variables) => {
      login(data.accessToken, data.refreshToken, variables.email);
    },

    onError: (error: any) => {
      console.error("Authentication mutation cycle aborted:", error.message);
    },
  });
};

export const useRegisterMutation = () => {
  const { login } = useAuth();
  return useMutation({
    mutationFn: async (registerForm: Record<string, string>) => {
      await api.post("/auth/register", registerForm);

      const loginResponse = await api.post<LoginResponse>("/auth/login", {
        email: registerForm.email,
        password: registerForm.password,
      });

      return loginResponse.data;
    },

    onSuccess: (data, variables) => {
      login(data.accessToken, data.refreshToken, variables.email);
    },

    onError: (error: any) => {
      console.error("Authentication mutation cycle aborted:", error.message);
    },
  });
};
