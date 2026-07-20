namespace InterviewSimulator.Api.Models;

public class Question
{
    public Guid Id { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public Guid TopicId { get; set; }
    public Topic Topic { get; set; } = null!;
    public ICollection<InterviewQuestion> InterviewQuestions { get; set; } = new HashSet<InterviewQuestion>();
}