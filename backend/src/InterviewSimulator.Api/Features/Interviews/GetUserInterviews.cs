using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

using InterviewSimulator.Api.Data;

namespace InterviewSimulator.Api.Features.Interviews;

public class GetUserInterviews
{
    public record Response(List<InterviewDto> Interviews);

    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/interviews", HandleAsync)
           .WithName("GetUserInterviews")
           .WithTags("Interviews")
           .Produces<Response>(StatusCodes.Status200OK)
           .ProducesValidationProblem(StatusCodes.Status400BadRequest)
           .RequireAuthorization();
    }

    private static async Task<IResult> HandleAsync(
        AppDbContext dbContext,
        ClaimsPrincipal user,
        CancellationToken ct)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
        {
            return Results.Unauthorized();
        }

        var interviews = await dbContext.InterviewSessions
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => new InterviewDto(
                InterviewSessionId: s.Id,
                UserId: s.UserId,
                CreatedAt: s.CreatedAt.UtcDateTime,
                StartedAt: s.StartedAt != null ? s.StartedAt.Value.UtcDateTime : null,
                CompletedAt: s.CompletedAt != null ? s.CompletedAt.Value.UtcDateTime : null,
                Score: s.Score,
                Feedback: s.Feedback,
                QuestionCount: s.QuestionCount,
                Status: s.Status.ToString()))
            .ToListAsync(ct);

        var response = new Response(interviews);
        return Results.Ok(response);
    }
}

public record InterviewDto(
    Guid InterviewSessionId,
    string UserId,
    DateTime CreatedAt,
    DateTime? StartedAt,
    DateTime? CompletedAt,
    int? Score,
    string Feedback,
    int QuestionCount,
    string Status);