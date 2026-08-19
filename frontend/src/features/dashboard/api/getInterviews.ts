import { useQuery } from "@tanstack/react-query";
import api from "../../../shared/api/api";
import type { SessionStatus } from "../../../shared/types/interview";

export interface InterviewDto {
    interviewSessionId: string,
    userId: string,
    createdAt: string,
    startedAt: string | null,
    completedAt: string | null,
    score: number | null,
    feedback: string | null,
    questionCount: number,
    status: SessionStatus,
}

export interface GetUserInterviewsResponse {
    interviews: InterviewDto[],
}

export const getInterviews = async () : Promise<InterviewDto[]> => {
    const response = await api.get<GetUserInterviewsResponse>("/interviews");
    return response.data.interviews;
}

export const useCandidateInterviews = () => {
    return useQuery({
        queryKey: ["interviews"],
        queryFn: getInterviews,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}