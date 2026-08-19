using InterviewSimulator.Api.Models;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace InterviewSimulator.Api.Data;

public class InterviewConfiguration : IEntityTypeConfiguration<InterviewSession>
{
    public void Configure(EntityTypeBuilder<InterviewSession> builder)
    {
        builder.Property(s => s.Status)
            .HasConversion<string>();

        builder
            .Property(s => s.TargetRole)
            .IsRequired()
            .HasMaxLength(100);

        builder
            .Property(s => s.Seniority)
            .IsRequired()
            .HasMaxLength(100);
    }
}