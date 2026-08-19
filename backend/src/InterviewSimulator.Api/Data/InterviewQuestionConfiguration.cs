using InterviewSimulator.Api.Models;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace InterviewSimulator.Api.Data;

public class InterviewQuestionConfiguration : IEntityTypeConfiguration<InterviewQuestion>
{
    public void Configure(EntityTypeBuilder<InterviewQuestion> builder)
    {
        builder.HasOne(iq => iq.Question)
            .WithMany(q => q.InterviewQuestions)
            .HasForeignKey(iq => iq.QuestionId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}