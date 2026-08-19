import type { InterviewDto } from "../api/getInterviews";

export const SessionCard: React.FC<{ interview: InterviewDto }> = ({ interview }) => {
  return (
    <div className="border rounded p-4 mb-4">
      <h2>{interview.interviewSessionId}</h2>
      <p>{interview.status}</p>
    </div>
  );
};
