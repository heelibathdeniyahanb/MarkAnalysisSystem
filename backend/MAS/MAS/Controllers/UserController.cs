using MAS.Services;
using Microsoft.AspNetCore.Mvc;
using MAS.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using MAS.Models;


namespace MAS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly TokenService _tokenService;

        public UserController(UserService userService, TokenService tokenService)
        {
            _userService = userService;
            _tokenService = tokenService;
        }

        [HttpGet("all-users")]
        public async Task<IActionResult> GetAsync()
        {
            var users = await _userService.GetAllUsersAsync();
            if (!users.Any())
            {
                return NotFound("No users found.");
            }
            return Ok(users);
        }
      

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (dto == null)
            {
                return BadRequest("User data is null");
            }
            try
            {
                var user = await _userService.Register(dto);
                return Ok(new { user.Id, user.Email, user.StudentId, user.Role, user.FirstName, user.LastName });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userService.Authenticate(dto.Email, dto.Password);
            if (user == null) return Unauthorized("Invalid login credentials");

            var token = _tokenService.GenerateToken(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // Enable for HTTPS
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddHours(1)
            };

            Response.Cookies.Append("jwt", token, cookieOptions);

            return Ok(new
            {
                message = "Logged in successfully",
                token,
                user = new
                {
                    user.Id,
                    user.Email,
                    user.StudentId,
                    user.Role,
                    user.FirstName,
                    user.LastName
                }
            });
        }
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");
            return Ok(new { message = "Logged out successfully" });
        }

        [HttpGet("get-user/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userService.GetUserById(id);
            if (user == null)
            {
                return NotFound("User not found");
            }

            return Ok(new
            {
                user.Id,
                user.Email,
                user.StudentId,
                user.Role,
                user.FirstName,
                user.LastName
               
            });
        }

        [HttpGet("get-current-user")]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                var token = Request.Cookies["jwt"];
                if (string.IsNullOrEmpty(token))
                {
                    return Unauthorized("No token provided");
                }

                var userId = _tokenService.ValidateTokenAndGetUserId(token);
                if (userId == null)
                {
                    return Unauthorized("Invalid token");
                }

                var user = await _userService.GetUserById(userId.Value);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                return Ok(new
                {
                    user.Id,
                    user.Email,
                    user.StudentId,
                    user.Role,
                    user.FirstName,
                    user.LastName
               
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


       }
        // Make sure this is at the class level, not inside another method
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var result = await _userService.DeleteUser(id);
                if (!result)
                {
                    return NotFound("User not found or could not be deleted");
                }

                return Ok(new { message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error deleting user", error = ex.Message });
            }
        }

    }

}

