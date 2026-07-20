namespace InterviewSimulator.Api.Models;

public class InterviewSession
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? StartedAt { get; set; }
    public DateTimeOffset? CompletedAt { get; set; }
    public int? Score { get; set; }
    public string Feedback { get; set; } = string.Empty;
    public int QuestionCount { get; set; }
    public SessionStatus Status { get; set; }

    public User User { get; set; } = null!;
    public List<InterviewQuestion> InterviewQuestions { get; set; } = new List<InterviewQuestion>();

    private InterviewSession()
    {
        // Required by EF Core
    }

    public InterviewSession(string userId, int questionCount)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        CreatedAt = DateTimeOffset.UtcNow;
        QuestionCount = questionCount;
        Status = SessionStatus.Created;
    }

    public InterviewSession(User user, int questionCount)
    {
        Id = Guid.NewGuid();
        UserId = user.Id;
        CreatedAt = DateTimeOffset.UtcNow;
        QuestionCount = questionCount;
        Status = SessionStatus.Created;
    }

    public void Start()
    {
        if (Status != SessionStatus.Created)
        {
            throw new InvalidOperationException("Cannot start a session that is not in the 'Created' state.");
        }

        if (InterviewQuestions.Count != QuestionCount)
        {
            throw new InvalidOperationException("Cannot start a session with an incorrect number of questions.");
        }

        StartedAt = DateTimeOffset.UtcNow;
        Status = SessionStatus.Started;
    }

    public void Complete(int score, string feedback)
    {
        if (Status != SessionStatus.Started)
        {
            throw new InvalidOperationException("Cannot complete a session that is not in the 'Started' state.");
        }

        if (score < 0 || score > 100)
        {
            throw new ArgumentOutOfRangeException(nameof(score), "Score must be between 0 and 100.");
        }

        Score = score;
        Feedback = feedback;
        CompletedAt = DateTimeOffset.UtcNow;
        Status = SessionStatus.Completed;
    }

    public void AddInterviewQuestion(InterviewQuestion interviewQuestion)
    {
        if (Status != SessionStatus.Created)
        {
            throw new InvalidOperationException("Cannot add questions to a session that is not in the 'Created' state.");
        }

        if (InterviewQuestions.Count >= QuestionCount)
        {
            throw new InvalidOperationException("Cannot add more questions than the specified question count.");
        }

        InterviewQuestions.Add(interviewQuestion);
    }

    public void RemoveInterviewQuestion(InterviewQuestion interviewQuestion)
    {
        if (Status != SessionStatus.Created)
        {
            throw new InvalidOperationException("Cannot remove questions from a session that is not in the 'Created' state.");
        }

        InterviewQuestions.Remove(interviewQuestion);
    }
}