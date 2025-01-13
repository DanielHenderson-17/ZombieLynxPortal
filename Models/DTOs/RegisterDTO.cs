using System.ComponentModel.DataAnnotations;

namespace ZombieLynxPortalAPI.DTOs
{
    public class RegisterDTO
    {
        [Required, EmailAddress]
        public string Email { get; set; }

        [Required, MinLength(6)]
        public string Password { get; set; }

        [Required, MinLength(6)]
        public string ConfirmPassword { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }
        // Optional role assignment for admins
        public string? Role { get; set; }
    }
}
