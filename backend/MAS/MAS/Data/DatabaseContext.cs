using MAS.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;

namespace MAS.Data
{
    public class DatabaseContext:DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Email> Emails { get; set; }
        public DbSet<Test> Tests { get; set; }
        public DbSet<Mark>Marks { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Email Attachments Configuration
            modelBuilder.Entity<Email>()
               .HasMany(e => e.Attachments)
               .WithOne(a => a.Email)
               .HasForeignKey(a => a.EmailId);

            modelBuilder.Entity<Test>()
           .HasMany(t => t.Marks)
           .WithOne(m => m.Test)
           .HasForeignKey(e => e.TestId)
           .IsRequired();

            modelBuilder.Entity<Mark>()
            .HasOne(m => m.Student)
            .WithMany(u => u.Marks)
            .HasForeignKey(m => m.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
       .HasIndex(u => u.StudentId)
       .IsUnique()
       .HasFilter("[Role] = 1");
            base.OnModelCreating(modelBuilder);
        }
        }
}
