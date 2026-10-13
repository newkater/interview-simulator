import { Link } from "react-router-dom";
import type { SessionStatus } from "../../../shared/types/interview";
import type { InterviewDto } from "../api/getInterviews";

export const SessionCard: React.FC<{ interview: InterviewDto }> = ({
  interview,
}) => {const formatDate = (dateString?: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formattedCreatedAt = formatDate(interview.createdAt);
  const formattedCompletedAt = formatDate(interview.completedAt);

  const renderStatusBadge = (status: SessionStatus) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-600 text-emerald-50 border border-emerald-700">
            Completed
          </span>
        );
      case "Started":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-600 text-amber-50 border border-amber-700">
            Started
          </span>
        );
      case "Created":
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-600 text-slate-100 border border-slate-700">
            Created
          </span>
        );
    }
  };

  const getActionConfig = (status: SessionStatus, id: string) => {
    switch (status) {
      case "Completed":
        return {
          label: "Review Feedback",
          path: `/interviews/${id}/review`,
          btnClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
        };
      case "Started":
        return {
          label: "Continue Interview",
          path: `/interviews/${id}`,
          btnClass: "bg-indigo-600 hover:bg-indigo-700 text-white",
        };
      case "Created":
      default:
        return {
          label: "Start Interview",
          path: `/interviews/${id}`,
          btnClass: "bg-indigo-600 hover:bg-indigo-700 text-white",
        };
    }
  };

  const action = getActionConfig(
    interview.status,
    interview.interviewSessionId,
  );

  return (
    <div className="bg-slate-100 border rounded-xl border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden">
      {/* Title */}
      <div className="bg-slate-300 border-b border-slate-200/80 p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 px-2.5 py-0.5">
            {interview.seniority}
          </span>
          {renderStatusBadge(interview.status)}
        </div>
        <h3 className="text-base font-bold text-slate-800 leading-snug line-clamp-2 px-2.5">
          {interview.targetRole}
        </h3>
      </div>
      <div className="p-4 flex-1 space-y-4">
        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Questions:</span>
            <span className="font-medium text-slate-800">
              {interview.questionCount}
            </span>
          </div><div className="flex justify-between">
            <span>Created:</span>
            <span className="font-medium text-slate-700">{formattedCreatedAt}</span>
          </div>
          {formattedCompletedAt && (
            <div className="flex justify-between">
              <span>Completed:</span>
              <span className="font-medium text-slate-700">{formattedCompletedAt}</span>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 pt-0">
        <Link
          to={action.path}
          className={`w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg shadow-xs transition-colors ${action.btnClass}`}
        >
          {action.label}
        </Link>
      </div>
    </div>
  );
};
