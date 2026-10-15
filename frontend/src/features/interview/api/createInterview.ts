import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../shared/api/api";

export interface CreateInterviewRequest {
  targetRole: string;
  seniority?: string;
  topics: string[];
  questionCount?: number;
}

export interface InterviewQuestionResponse {
  id: string;
  questionText: string;
  topicId: string;
  topic: string;
}

export interface CreateInterviewResponse {
  id: string;
  targetRole: string;
  seniority?: string;
  questions: InterviewQuestionResponse[];
}
export const createInterview = async (
  payload: CreateInterviewRequest,
): Promise<CreateInterviewResponse> => {
  try {
    const response = await api.post<CreateInterviewResponse>(
      "/interviews/generate",
      payload,
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.title ||
      "Failed to create interview";
    throw new Error(errorMessage);
  }
};

export const useCreateInterviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInterview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
    },
  });
};
