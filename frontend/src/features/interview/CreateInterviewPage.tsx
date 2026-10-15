import { useNavigate } from "react-router-dom";
import { CreateInterviewForm } from "./components/CreateInterviewForm";
import {
  useCreateInterviewMutation,
  type CreateInterviewRequest,
} from "./api/createInterview";

export const CreateInterviewPage: React.FC = () => {
  const navigate = useNavigate();
  const createInterviewMutation = useCreateInterviewMutation();

  const handleFormSubmit = (formData: CreateInterviewRequest) => {
    createInterviewMutation.mutate(formData, {
      onSuccess: (response) => {
        navigate(`/interviews/${response.id}`);
      },
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Configure New Mock Interview
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Specify your target role and focus areas. Our AI engine will generate
          tailored technical questions.
        </p>
      </div>
      <CreateInterviewForm
        onSubmit={handleFormSubmit}
        isLoading={createInterviewMutation.isPending}
        errorMessage={
          createInterviewMutation.isError
            ? createInterviewMutation.error instanceof Error
              ? createInterviewMutation.error.message
              : "Failed to create interview"
            : null
        }
      />
    </div>
  );
};
