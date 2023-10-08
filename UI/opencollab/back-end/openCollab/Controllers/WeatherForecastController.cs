using Microsoft.AspNetCore.Mvc;

namespace openCollab.Controllers;

[ApiController]
[Route("")]
public class WeatherForecastController : ControllerBase
{
    private readonly DataContext Context;

    public WeatherForecastController(DataContext context)
    {
        Context = context;
    }

    [HttpPost("auth/register")]
    public IActionResult Register([FromForm] RegisterDto dto)
    {
        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            Password = dto.Password
        };

        Context.Users.Add(user);
        Context.SaveChanges();

        return Ok(user);
    }

    [HttpPost("auth/login")]
    public IActionResult Login(LoginDto dto)
    {
        var user = new User
        {
            Email = dto.Email,
            Password = dto.Password
        };

        var existing = Context.Users.FirstOrDefault(u => u.Email == user.Email);
        if (existing is null) {
            return NotFound("User not found");
        }

        if (existing.Password != user.Password) {
            return BadRequest("Invalid password");
        }

        return Ok(existing.Id);
    }

    [HttpPost("project/create")]
    public IActionResult CreateProject(ProjectDto dto)
    {
        var project = new Project
        {
            Name = dto.Name,
            Description = dto.Description,
            UserId = dto.UserId
        };

        Context.Projects.Add(project);
        Context.SaveChanges();

        return Ok(project);
    }
}

public class LoginDto
{
    public string Email { get; set; }
    public string Password { get; set; }
}

public class RegisterDto
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string Name { get; set; }
    public IFormFile Avatar { get; set; }
}

public class ProjectDto {
    public string Name { get; set; }
    public string Description { get; set; }
    public int UserId { get; set; }
}
