using System.ComponentModel.DataAnnotations;

namespace MAS.Dtos
{
    public class RegisterDto
    {
       
        [Required]
        [StringLength(150)]
        public string Email { get; set; } = string.Empty;

       

        [Required]
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        public UserRole Role { get; set; }



        public enum UserRole
        {
            Admin,
            Student
        }
    }
}
