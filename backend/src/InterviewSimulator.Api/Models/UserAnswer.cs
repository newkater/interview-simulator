namespace InterviewSimulator.Api.Models;

public class UserAnswer
{
    public Guid Id { get; set; }
    public Guid InterviewQuestionId { get; set; }
    public Guid InterviewSessionId { get; set; }
    public string AnswerTranscript { get; set; } = string.Empty;
    public int Score { get; set; }
    public string Feedback { get; set; } = string.Empty;
    public string AudioBlobUrl { get; set; } = string.Empty;

    public InterviewQuestion InterviewQuestion { get; set; } = null!;
    public InterviewSession InterviewSession { get; set; } = null!;
    
    private UserAnswer() { }

    public UserAnswer(Guid interviewQuestionId, Guid interviewSessionId)
    {
        InterviewQuestionId = interviewQuestionId;
        InterviewSessionId = interviewSessionId;
    }

    public void UpdateEvaluation(string transcript, int score, string feedback, string audioUrl)
    {
        if (InterviewSession?.Status == SessionStatus.Completed)
            throw new InvalidOperationException("Cannot modify answers or scores belonging to a completed interview session.");

        AnswerTranscript = transcript;
        Score = score;
        Feedback = feedback;
        AudioBlobUrl = audioUrl;
    }
}