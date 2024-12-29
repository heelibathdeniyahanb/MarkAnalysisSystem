using Microsoft.Extensions.Hosting;
using System.ComponentModel.DataAnnotations;

namespace MAS.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        public int? StudentId { get; set; }

        [Required]
        [StringLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
       
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        public UserRole Role { get; set; }
        public ICollection<Mark> Marks { get; } = new List<Mark>();



        public enum UserRole
        {
            Admin,
            Student
        }

        
       
    }
}
