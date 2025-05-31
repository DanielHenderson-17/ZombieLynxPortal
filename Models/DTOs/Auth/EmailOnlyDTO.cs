using System.ComponentModel.DataAnnotations;

namespace ZombieLynxPortalAPI.DTOs
{
    public class EmailOnlyDTO
    {
        [Required, EmailAddress]
        public string Email { get; set; }
    }
}
