using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using InterviewSimulator.Api.Data;
using InterviewSimulator.Api.Models;
using InterviewSimulator.Api.Features.Topics;

using OpenAI;
using Microsoft.Extensions.AI;
using Azure.AI.OpenAI;
using Azure;
using InterviewSimulator.Api.Features.Interviews;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure the Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Enable Authorization Services
builder.Services.AddAuthorizationBuilder();

// 3. Configure Identity API Endpoints (This automatically adds Bearer Token Auth!)
builder.Services.AddIdentityApiEndpoints<User>()
    .AddEntityFrameworkStores<AppDbContext>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ViteClient", policy =>
    {
        policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
    });
});

builder.Services.AddChatClient(services =>
{
    // 1. Fetch values from settings
    var endpoint = builder.Configuration["AzureOpenAI:Endpoint"] 
                   ?? throw new InvalidOperationException("Endpoint is missing.");
    var apiKey = builder.Configuration["AzureOpenAI:ApiKey"] 
                 ?? throw new InvalidOperationException("API Key is missing.");
    var deploymentName = builder.Configuration["AzureOpenAI:DeploymentName"] 
                         ?? throw new InvalidOperationException("DeploymentName is missing.");

    // 2. Initialize the overarching Azure OpenAI client
    var azureClient = new AzureOpenAIClient(new Uri(endpoint), new AzureKeyCredential(apiKey));

    // 3. Extract the underlying target model and wrap it into the ecosystem abstraction
    return azureClient
        .GetChatClient(deploymentName)
        .AsIChatClient();
});

var app = builder.Build();

// 4. Ensure Authentication & Authorization Middlewares are registered
// (Add these before your endpoints if they aren't already there)
app.UseCors("ViteClient");
app.UseAuthentication();
app.UseAuthorization();

// 5. Map the Identity endpoints
app.MapGroup("/api/auth")
   .MapIdentityApi<User>();
   
app.MapGet("/api/me", (System.Security.Claims.ClaimsPrincipal user) =>
{
    var username = user.Identity?.Name ?? "Unknown User";
    
    return Results.Ok(new 
    { 
        Message = $"Hello {username}, your auth token is fully valid!",
        Username = username
    });
})
.RequireAuthorization();

// 6. Map your custom endpoints
CreateTopic.MapEndpoint(app);
GetTopics.MapEndpoint(app);
GenerateInterview.MapEndpoint(app);
GetUserInterviews.MapEndpoint(app);
GetInterview.MapEndpoint(app);

app.Run();