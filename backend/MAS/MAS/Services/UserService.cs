using MAS.Data;
using MAS.Dtos;
using MAS.Models;
using Microsoft.EntityFrameworkCore;
using MAS.Controllers;

namespace MAS.Services
{
    public class UserService
    {
        private readonly DatabaseContext _context;
        private readonly Controllers.EmailController _emailController;

        public UserService(DatabaseContext context, Controllers.EmailController emailController)
        {
            _context = context;
            _emailController = emailController;
        }

        private string GenerateTemporaryPassword(int length = 12)
        {
            const string validChars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*?_-";
            var random = new Random();
            return new string(Enumerable.Repeat(validChars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public async Task<User?> Authenticate(string email, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                return null;
            }
            return user;
        }
        private async Task<int> GenerateStudentIdAsync()
        {
            // Retrieve the highest existing StudentId in the database
            var highestStudentId = await _context.Users
                .Where(u => u.Role == User.UserRole.Student && u.StudentId.HasValue)
                .MaxAsync(u => (int?)u.StudentId) ?? 9999;

            // Generate the next StudentId
            return highestStudentId + 1;
        }

        public async Task<User> Register(RegisterDto dto)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (existingUser != null)
            {
                throw new ArgumentException("Email already exists");
            }

            // Generate a temporary password
            var temporaryPassword = GenerateTemporaryPassword();

            // Hash the generated password
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(temporaryPassword);

            // If the role is Student, generate a StudentId
            int? studentId = null;
            if (dto.Role == RegisterDto.UserRole.Student)
            {
                studentId = await GenerateStudentIdAsync();
            }

            var user = new User
            {
                Email = dto.Email,
                StudentId = studentId,
                PasswordHash = hashedPassword,
                Role = (User.UserRole)dto.Role,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Send login details to user's email
            await _emailController.SendLoginDetails(user.Email, temporaryPassword);

            return user;
        }

        public async Task<User> GetUserById(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID {id} not found.");
            }
            return user;
        }

        public async Task<bool> DeleteUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return false;
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

       public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            try
            {
                return await _context.Users.ToListAsync();
            }
            catch (Exception ex)
            {
                // Log exception
                throw new Exception("Error retrieving users", ex);
            }
        }

    }


}

