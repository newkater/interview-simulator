namespace InterviewSimulator.Api.Models;

public class InterviewQuestion
{
    public Guid Id { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public Guid? QuestionId { get; set; }
    public Guid TopicId { get; set; }
    public Guid InterviewSessionId { get; set; }

    public Question? Question { get; set; }
    public Topic Topic { get; set; } = null!;
    public InterviewSession InterviewSession { get; set; } = null!;
    public UserAnswer? UserAnswer { get; set; }

    private InterviewQuestion() { }

    public InterviewQuestion(string questionText, int sortOrder, Guid topicId, Guid interviewSessionId, Guid? questionId = null)
    {
        Id = Guid.NewGuid();
        QuestionText = questionText;
        SortOrder = sortOrder;
        TopicId = topicId;
        InterviewSessionId = interviewSessionId;
        QuestionId = questionId;
    }

    public void AddAnswer(UserAnswer userAnswer)
    {
        if (UserAnswer != null)
        {
            throw new InvalidOperationException("An answer has already been added for this question.");
        }

        UserAnswer = userAnswer;
    }
}