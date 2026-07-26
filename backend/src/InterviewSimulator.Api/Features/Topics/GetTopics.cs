using InterviewSimulator.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace InterviewSimulator.Api.Features.Topics;

public class GetTopics
{
    public record Response(Guid Id, string Name);

    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/topics", HandleAsync)
           .WithName("GetTopics")
           .WithTags("Topics")
           .Produces<List<Response>>(StatusCodes.Status200OK)
           .RequireAuthorization();
    }

    private static async Task<IResult> HandleAsync(
        AppDbContext dbContext, 
        CancellationToken ct)
    {
        var topics = await dbContext.Topics
            .Select(t => new Response(t.Id, t.Name))
            .ToListAsync(ct);

        return Results.Ok(topics);
    }
}