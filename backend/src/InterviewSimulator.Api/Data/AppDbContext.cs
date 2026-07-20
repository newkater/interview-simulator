using InterviewSimulator.Api.Models;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace InterviewSimulator.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<IdentityUser>(options)
{
    public DbSet<Topic> Topics => Set<Topic>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<InterviewQuestion> InterviewQuestions => Set<InterviewQuestion>();
    public DbSet<InterviewSession> InterviewSessions => Set<InterviewSession>();
    public DbSet<UserAnswer> UserAnswers => Set<UserAnswer>();
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<InterviewSession>()
            .Property(s => s.Status)
            .HasConversion<string>();

        builder.Entity<InterviewQuestion>()
            .HasOne(iq => iq.Question)
            .WithMany(q => q.InterviewQuestions)
            .HasForeignKey(iq => iq.QuestionId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<UserAnswer>()
            .HasIndex(ua => new { ua.InterviewSessionId, ua.InterviewQuestionId })
            .IsUnique();
    }
}