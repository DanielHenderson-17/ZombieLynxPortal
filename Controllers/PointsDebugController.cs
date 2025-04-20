using Microsoft.AspNetCore.Mvc;
using ZombieLynxPortalAPI.Services;

namespace ZombieLynxPortalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PointsDebugController : ControllerBase
    {
        private readonly PointsDbConnectionService _connService;

        public PointsDebugController(PointsDbConnectionService connService)
        {
            _connService = connService;
        }

        [HttpGet("{key}")]
        public IActionResult GetConnectionStringFor(string key)
        {
            try
            {
                var conn = _connService.GetConnectionString(key);
                return Ok(new { key, connection = conn });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("all")]
        public IActionResult GetAll()
        {
            var all = _connService.GetAllConnections();
            return Ok(all);
        }


    }
}
