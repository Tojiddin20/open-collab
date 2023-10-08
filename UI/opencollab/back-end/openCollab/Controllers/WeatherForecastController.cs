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

    [HttpPost("projects/discover")]
    public IActionResult ProjectsDiscover([FromBody] DiscoveryDto dto)
    {
        // Get projects that current user has not reviewed yet
        var result = Context.Projects
            .Where(pr => pr.UserReviews.All(ur => ur.UserId != dto.UserId))
            .FirstOrDefault();

        return Ok(result);
    }

    [HttpGet("projects")]
    public IActionResult Projects()
    {
        return Ok(Context.Projects.ToList());
    }

    [HttpPost("project/create")]
    public IActionResult CreateProject([FromForm] ProjectDto dto)
    {
        string imagePath = SaveImage(dto);

        var project = new Project
        {
            Name = dto.Name,
            Description = dto.Description,
            UserId = dto.UserId,
            ImagePath = imagePath
        };

        Context.Projects.Add(project);
        Context.SaveChanges();

        return Ok(project);
    }

    private static string SaveImage(ProjectDto dto)
    {
        var fileName = dto.Image.FileName;
        var imagePath = Path.Combine("wwwroot", fileName);
        using (var stream = new FileStream(imagePath, FileMode.Create))
        {
            dto.Image.CopyTo(stream);
        }

        return fileName;
    }

    [HttpGet("projects/{id}")]
    public IActionResult GetProjects(int id)
    {
        var projects = Context.Projects.FirstOrDefault(p => p.Id == id);
        if (projects is null) {
            return NotFound("Project not found");
        }
        return Ok(projects);
    }
}

public class DiscoveryDto
{
    public int UserId { get; set; }
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
    public IFormFile Image { get; set; }
}
