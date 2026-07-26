using System.Security.Claims;

using InterviewSimulator.Api.Data;

using Microsoft.EntityFrameworkCore;

namespace InterviewSimulator.Api.Features.Interviews;

public class GetInterview
{
    public record Request(Guid InterviewSessionId);
    public record Response(
        Guid InterviewSessionId,
        string UserId,
        DateTime CreatedAt,
        DateTime? StartedAt,
        DateTime? CompletedAt,
        int? Score,
        string Feedback,
        int QuestionCount,
        string Status,
        List<InterviewQuestionDto> Questions);

    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/interviews/{interviewSessionId}", HandleAsync)
           .WithName("GetInterview")
           .WithTags("Interviews")
           .Produces<Response>(StatusCodes.Status200OK)
           .ProducesValidationProblem(StatusCodes.Status400BadRequest)
           .RequireAuthorization();
    }

    private static async Task<IResult> HandleAsync(
        Guid interviewSessionId,
        AppDbContext dbContext,
        ClaimsPrincipal user,
        CancellationToken ct)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
        {
            return Results.Unauthorized();
        }

        var interviewSession = await dbContext.InterviewSessions
            .Include(s => s.InterviewQuestions)
                .ThenInclude(iq => iq.Topic)
            .Include(s => s.InterviewQuestions)
                .ThenInclude(iq => iq.UserAnswer)
            .FirstOrDefaultAsync(s => s.Id == interviewSessionId && s.UserId == userId, ct);

        if (interviewSession == null)
        {
            return Results.NotFound();
        }

        if (interviewSession.UserId != userId)
        {
            return Results.Forbid();
        }

        var response = new Response(
            InterviewSessionId: interviewSession.Id,
            UserId: interviewSession.UserId,
            CreatedAt: interviewSession.CreatedAt.UtcDateTime,
            StartedAt: interviewSession.StartedAt?.UtcDateTime,
            CompletedAt: interviewSession.CompletedAt?.UtcDateTime,
            Score: interviewSession.Score,
            Feedback: interviewSession.Feedback,
            QuestionCount: interviewSession.QuestionCount,
            Status: interviewSession.Status.ToString(),
            Questions: [.. interviewSession.InterviewQuestions
                .OrderBy(iq => iq.SortOrder)
                .Select(iq => new InterviewQuestionDto(
                    Id: iq.Id,
                    QuestionText: iq.QuestionText,
                    SortOrder: iq.SortOrder,
                    TopicId: iq.Topic.Id,
                    TopicName: iq.Topic.Name,
                    UserAnswer: iq.UserAnswer != null ? new UserAnswerDto(
                        Id: iq.UserAnswer.Id,
                        AnswerTranscript: iq.UserAnswer.AnswerTranscript,
                        Score: iq.UserAnswer.Score,
                        Feedback: iq.UserAnswer.Feedback
                    ) : null,
                    QuestionId: iq.QuestionId
                ))]
        );

        return Results.Ok(response);
    }
}

public record InterviewQuestionDto(Guid Id, string QuestionText, int SortOrder, Guid TopicId, string TopicName, UserAnswerDto? UserAnswer, Guid? QuestionId);

public record UserAnswerDto(Guid Id, string AnswerTranscript, int Score, string Feedback);