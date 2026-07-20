namespace InterviewSimulator.Api.Models;

public class UserAnswer
{
    public Guid Id { get; set; }
    public Guid InterviewQuestionId { get; set; }
    public string AnswerTranscript { get; set; } = string.Empty;
    public int Score { get; set; }
    public string Feedback { get; set; } = string.Empty;
    public string AudioBlobUrl { get; set; } = string.Empty;

    public InterviewQuestion InterviewQuestion { get; set; } = null!;
    private UserAnswer() { }

    public UserAnswer(Guid interviewQuestionId)
    {
        InterviewQuestionId = interviewQuestionId;
    }
}