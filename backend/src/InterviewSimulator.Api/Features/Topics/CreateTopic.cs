using InterviewSimulator.Api.Data;
using InterviewSimulator.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace InterviewSimulator.Api.Features.Topics;

public class CreateTopic
{
    public record Request(string Name);

    public record Response(Guid Id, string Name);

    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/topics", HandleAsync)
           .WithName("CreateTopic")
           .WithTags("Topics")
           .Produces<Response>(StatusCodes.Status201Created)
           .ProducesValidationProblem(StatusCodes.Status400BadRequest)
           .ProducesProblem(StatusCodes.Status409Conflict)
           .RequireAuthorization();
    }

    private static async Task<IResult> HandleAsync(
        Request request, 
        AppDbContext dbContext, 
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return Results.ValidationProblem(new Dictionary<string, string[]>
            {
                { nameof(request.Name), new[] { "Topic name cannot be empty." } }
            });
        }

        var normalizedName = request.Name.Trim();

        var exists = await dbContext.Topics
            .AnyAsync(t => t.Name.ToLower() == normalizedName.ToLower(), ct);

        if (exists)
        {
            return Results.Problem(
                detail: $"A topic with the name '{normalizedName}' already exists.",
                statusCode: StatusCodes.Status409Conflict);
        }

        var topic = new Topic
        {
            Id = Guid.NewGuid(),
            Name = normalizedName
        };

        dbContext.Topics.Add(topic);
        await dbContext.SaveChangesAsync(ct);

        var response = new Response(topic.Id, topic.Name);
        return Results.Created($"/api/topics/{topic.Id}", response);
    }
}