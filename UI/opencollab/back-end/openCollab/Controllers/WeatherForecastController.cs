using Microsoft.AspNetCore.Mvc;

namespace openCollab.Controllers;

[ApiController]
[Route("")]
public class WeatherForecastController : ControllerBase
{
    private readonly DataContext Context;

    [HttpPost("reg")]
    public IActionResult Register(RegisterDto dto)
    {

    }

    [HttpGet("")]
    public IActionResult CreateProject()
    {

    }
}

public class RegisterDto
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string Name { get; set; }
    public IFormFile Avatar { get; set; }
}
