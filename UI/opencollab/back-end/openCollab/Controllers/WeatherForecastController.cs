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

    [HttpGet("project/create")]
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
