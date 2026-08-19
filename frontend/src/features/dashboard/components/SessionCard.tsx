import type { InterviewDto } from "../api/getInterviews";

export const SessionCard: React.FC<{ interview: InterviewDto }> = ({
  interview,
}) => {
  return (
    <div className="bg-slate-100 border rounded-xl border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden">
      <div className="bg-blue-200 border-b border-slate-200/80 p-4">
        <span>{interview.seniority}</span>
      </div>
      <div className="p-4 flex-1 space-y-4">
        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Questions:</span>
            <span className="font-medium text-slate-800">
              {interview.questionCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
