import React, { useState } from "react";
import type { CreateInterviewRequest } from "../api/createInterview";

interface CreateInterviewFormProps {
  onSubmit: (data: CreateInterviewRequest) => void;
  isLoading: boolean;
  errorMessage?: string | null;
}

export const CreateInterviewForm: React.FC<CreateInterviewFormProps> = ({
  onSubmit,
  isLoading,
  errorMessage,
}) => {
  const [targetRole, setTargetRole] = useState("");
  const [seniority, setSeniority] = useState<string>("");
  const [topicsInput, setTopicsInput] = useState("");
  const [questionCount, setQuestionCount] = useState<number>(5);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!targetRole.trim()) {
      return;
    }

    const topics = topicsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    onSubmit({
      targetRole,
      seniority: seniority as CreateInterviewRequest["seniority"],
      topics: topics.length > 0 ? topics : [],
      questionCount,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div>
        <label
          htmlFor="targetRole"
          className="block text-sm font-semibold text-slate-900 mb-1"
        >
          Target Role
        </label>
        <input
          id="targetRole"
          type="text"
          required
          placeholder="e.g., Frontend Developer, Senior Cloud Architect"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          className="w-full px-3.5 py-2.5 shadow-sm rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50"
        />
      </div>

      <div>
        <label
          htmlFor="seniority"
          className="block text-sm font-semibold text-slate-900 mb-1"
        >
          Seniority Level
        </label>
        <select
          id="seniority"
          value={seniority}
          onChange={(e) => setSeniority(e.target.value as any)}
          className="px-3.5 py-2.5 w-full border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 disabled:bg-slate-50"
        >
          <option value="">Not Specified / General</option>
          <option value="Trainee">Trainee</option>
          <option value="Junior">Junior</option>
          <option value="Middle">Middle</option>
          <option value="Senior">Senior</option>
          <option value="Lead">Lead</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="topics"
          className="block text-sm font-semibold text-slate-900 mb-1"
        >
          Focus Topics{" "}
          <span className="text-xs text-slate-500 font-normal">
            (Comma-separated, optional)
          </span>
        </label>
        <input
          id="topics"
          type="text"
          value={topicsInput}
          placeholder="e.g. Multithreading, Entity Framework Core, Azure Blob Storage"
          disabled={isLoading}
          onChange={(e) => setTopicsInput(e.target.value)}
          className="w-full px-3.5 py-2.5 shadow-sm rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label
            htmlFor="questionCount"
            className="block text-sm font-semibold text-slate-900"
          >
            Number of Questions
          </label>
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
            {questionCount} {questionCount === 1 ? "Question" : "Questions"}
          </span>
        </div>
        <input
          id="questionCount"
          type="number"
          min={1}
          max={20}
          value={questionCount}
          onChange={(e) =>
            setQuestionCount(Math.min(20, Math.max(1, Number(e.target.value))))
          }
          disabled={isLoading}
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50"
        />
        <p className="text-xs text-slate-400 mt-1 font-normal">
          Up to 20 questions can be created for a single interview.
        </p>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading || !targetRole.trim()}
          className="w-full inline-flex items-center justify-center px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:bg-indigo-300 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating..." : "Create Interview"}
        </button>
      </div>
    </form>
  );
};
