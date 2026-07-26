using System.Security.Claims;
using System.Text.Json;

using InterviewSimulator.Api.Data;
using InterviewSimulator.Api.Models;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.AI;

namespace InterviewSimulator.Api.Features.Interviews;

public class GenerateInterview
{
    public record Request(string TargetRole,
        string Seniority,
        List<string>? Topics,
        int QuestionCount = 5);

    public record Response(Guid Id,
        string TargetRole,
        string Seniority,
        List<InterviewQuestionResponse> Questions);

    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/interviews/generate", HandleAsync)
           .WithName("GenerateInterview")
           .WithTags("Interviews")
           .Produces<Response>(StatusCodes.Status201Created)
           .ProducesValidationProblem(StatusCodes.Status400BadRequest)
           .RequireAuthorization();
    }

    private static async Task<IResult> HandleAsync(
        Request request,
        AppDbContext dbContext,
        IChatClient chatClient,
        ClaimsPrincipal user,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.TargetRole))
        {
            return Results.ValidationProblem(new Dictionary<string, string[]>
            {
                { nameof(request.TargetRole), new[] { "Target role cannot be empty." } }
            });
        }

        if (string.IsNullOrWhiteSpace(request.Seniority))
        {
            return Results.ValidationProblem(new Dictionary<string, string[]>
            {
                { nameof(request.Seniority), new[] { "Seniority cannot be empty." } }
            });
        }

        if (request.QuestionCount <= 0)
        {
            return Results.ValidationProblem(new Dictionary<string, string[]>
            {
                { nameof(request.QuestionCount), new[] { "Question count must be greater than zero." } }
            });
        }

        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
        {
            return Results.Unauthorized();
        }

        var interviewSession = new InterviewSession(userId, request.QuestionCount);// A. Construct AI Prompts
        
        var systemPrompt = @"You are an expert technical interviewer. Generate a technical interview in valid JSON format.
Return a JSON object with a 'questions' key containing an array of objects:
{
  ""questions"": [
    {
      ""questionText"": ""string"",
      ""topic"": ""string""
    }
  ]
}";

        var topicsFormatted = request.Topics != null && request.Topics.Any()
            ? string.Join(", ", request.Topics)
            : "General core competencies";

        var userPrompt = $"Target Role: {request.TargetRole}\nSeniority: {request.Seniority}\nTopics: {topicsFormatted}\nQuestion Count: {request.QuestionCount}";
        
        var chatMessages = new List<ChatMessage>
        {
            new(ChatRole.System, systemPrompt),
            new(ChatRole.User, userPrompt)
        };
        var options = new ChatOptions
        {
            ResponseFormat = ChatResponseFormat.Json
        };

        ChatResponse response = await chatClient.GetResponseAsync(chatMessages, options, ct);
        var jsonResponse = response.Messages.Count > 0 
            ? response.Messages[0].Text 
            : response.Text;

        var wrapper = JsonSerializer.Deserialize<GeneratedQuestionsWrapper>(jsonResponse, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        var rawQuestions = wrapper?.Questions ?? new List<RawGeneratedQuestion>();

        var topics = rawQuestions.Select(q => q.Topic).Distinct().ToList();
        List<Topic> topicsInDb = new();

        foreach (var topicName in topics)
        {
            var topic = await GetOrCreateTopicAsync(dbContext, topicName, ct);
            topicsInDb.Add(topic);
        }

        var interviewQuestions = rawQuestions.Select((q, index) => new InterviewQuestion(
            questionText: q.QuestionText,
            sortOrder: index + 1,
            topicId: topicsInDb.First(t => t.Name.Equals(q.Topic, StringComparison.OrdinalIgnoreCase)).Id,
            interviewSessionId: interviewSession.Id
        )).ToList();

        interviewSession.AddInterviewQuestions(interviewQuestions);

        dbContext.InterviewSessions.Add(interviewSession);
        await dbContext.SaveChangesAsync(ct);

        var responseDto = new Response(
            Id: interviewSession.Id,
            TargetRole: request.TargetRole,
            Seniority: request.Seniority,
            Questions: interviewQuestions.Select(q => new InterviewQuestionResponse
            {
                Id = q.Id,
                QuestionText = q.QuestionText,
                TopicId = q.TopicId,
                Topic = topicsInDb.First(t => t.Id == q.TopicId).Name
            }).ToList()
        );

        return Results.Created($"/api/interviews/{interviewSession.Id}", responseDto);
    }

    private static async Task<Topic> GetOrCreateTopicAsync(AppDbContext dbContext, string topicName, CancellationToken ct)
    {
        var existingTopic = await dbContext.Topics
            .FirstOrDefaultAsync(t => t.Name.ToLower() == topicName.ToLower(), ct);

        if (existingTopic != null)
        {
            return existingTopic;
        }

        var newTopic = new Topic
        {
            Id = Guid.NewGuid(),
            Name = topicName
        };

        dbContext.Topics.Add(newTopic);
        await dbContext.SaveChangesAsync(ct);

        return newTopic;
    }
}

public record InterviewQuestionResponse
{
    public Guid Id { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public Guid TopicId { get; set; }
    public string Topic { get; set; } = string.Empty;
}

public record GeneratedQuestionsWrapper(List<RawGeneratedQuestion> Questions);
public record RawGeneratedQuestion(string QuestionText, string Topic);