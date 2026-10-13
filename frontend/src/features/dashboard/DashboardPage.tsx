import type React from "react";
import { useCandidateInterviews } from "./api/getInterviews";
import { SessionCard } from "./components/SessionCard";
import { Link } from "react-router-dom";

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

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-slate-100 rounded-xl border border-slate-200 p-4 animate-pulse space-y-4"
            >
              <div className="h-6 bg-slate-300 rounded w-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-300 rounded w-3/4"></div>
                <div className="h-4 bg-slate-300 rounded w-1/2"></div>
              </div>
              <div className="h-9 bg-slate-300 rounded w-full"></div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          <p className="font-semibold">Failed to load interview sessions.</p>
          <p className="text-xs mt-1">
            {error instanceof Error ? error.message : "An unknown error occurred."}
          </p>
        </div>
      )}

      {!isLoading && !isError && (!interviews || interviews.length === 0) && (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center my-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            No interview sessions yet.
          </h3>
          <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
            Start your first mock interview!
          </p>
          <Link
            to="/interviews/new"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-xs transition-colors"
          >
            + New Interview
          </Link>
        </div>
      )}

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
