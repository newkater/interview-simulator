import type React from "react";
import { useCandidateInterviews } from "./api/getInterviews";
import { SessionCard } from "./components/SessionCard";

export const DashboardPage: React.FC = () => {
  const {
    data: interviews,
    isError,
    isLoading,
    error,
  } = useCandidateInterviews();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Candidate Dashboard
        </h1>
        <p className="text-sm text-slate-600">
          Track your mock interview attempts and review AI performance feedback.
        </p>
      </div>
      {!isLoading && !isError && interviews && interviews.length > 0 && (
        <div className="grid *:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {interviews.map((interview) => (
            <SessionCard
              key={interview.interviewSessionId}
              interview={interview}
            />
          ))}
        </div>
      )}
    </div>
  );
};
