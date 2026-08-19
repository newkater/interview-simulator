import type React from "react";
import { Header } from "../../components/layout/Header";
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
    <div>
      <Header />
      <h1>Dashboard</h1>
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
