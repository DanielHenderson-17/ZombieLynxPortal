using Microsoft.AspNetCore.Mvc;

namespace ZombieLynxPortal.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ErrorController : ControllerBase
    {
        [HttpGet]
        public IActionResult HandleError(string message)
        {
            return Content($"<h1>Authentication Error</h1><p>{message}</p>", "text/html");
        }
    }
}
