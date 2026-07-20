namespace InterviewSimulator.Api.Models;

public class Topic
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public ICollection<Question> Questions { get; set; } = new HashSet<Question>();
    public ICollection<InterviewQuestion> InterviewQuestions { get; set; } = new HashSet<InterviewQuestion>();
}
