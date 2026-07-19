using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using InterviewSimulator.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure the Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Enable Authorization Services
builder.Services.AddAuthorizationBuilder();

// 3. Configure Identity API Endpoints (This automatically adds Bearer Token Auth!)
builder.Services.AddIdentityApiEndpoints<IdentityUser>()
    .AddEntityFrameworkStores<AppDbContext>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ViteClient", policy =>
    {
        policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
    });
});

var app = builder.Build();

// 4. Ensure Authentication & Authorization Middlewares are registered
// (Add these before your endpoints if they aren't already there)
app.UseCors("ViteClient");
app.UseAuthentication();
app.UseAuthorization();

// 5. Map the Identity endpoints
app.MapGroup("/api/auth")
   .MapIdentityApi<IdentityUser>();
   
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

app.Run();