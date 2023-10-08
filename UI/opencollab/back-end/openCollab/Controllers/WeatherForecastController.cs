using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        if (existing is null)
        {
            return NotFound("User not found");
        }

        if (existing.Password != user.Password)
        {
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
            .Include(x => x.User)
            .Select(x => new DiscoveryResponseDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                ImagePath = x.ImagePath,
                UserId = x.UserId,
                CreatorName = x.User.Name
            })
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
            ImagePath = imagePath,
        };

        project.Tags = dto.Tags.Select(t => new Tag { Name = t }).ToList();

        Context.Projects.Add(project);
        Context.SaveChanges();

        return Ok(new { Id = project.Id } );
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

    [HttpPost("matched")]
    public IActionResult GetMatchedProjects(MatchedDto dto)
    {
        var projects = Context.Projects
            .Include(x => x.User)
            .Where(p => p.UserReviews.Any(ur => ur.UserId == dto.UserId && ur.Approved == true))
            .Select(x => new DiscoveryResponseDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                ImagePath = x.ImagePath,
                UserId = x.UserId,
                CreatorName = x.User.Name
            })
            .ToList();

        return Ok(projects);
    }

    [HttpGet("projects/{id}")]
    public IActionResult GetProjects(int id)
    {
        var projects = Context.Projects.FirstOrDefault(p => p.Id == id);
        if (projects is null)
        {
            return NotFound("Project not found");
        }
        return Ok(projects);
    }

    [HttpPost("projects/vote")]
    public IActionResult VoteProject([FromBody] VoteDto dto)
    {
        Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(dto));

        var user = Context.Users.Include(x => x.Tags).FirstOrDefault(u => u.Id == dto.UserId);
        if (user is null)
        {
            return NotFound("User not found");
        }

        var project = Context.Projects.Include(x => x.Tags).FirstOrDefault(p => p.Id == dto.ProjectId);
        if (project is null)
        {
            return NotFound("Project not found");
        }

        var userReview = new UserReview
        {
            UserId = dto.UserId,
            ProjectId = dto.ProjectId,
            Approved = dto.Approve
        };

        var existingTags = user.Tags;
        var projectTags = project.Tags.Select(t => t.Name).ToList();
        var intersection = existingTags.Select(x => x.Name).Intersect(projectTags).ToList();

        Console.WriteLine("Existing tags: " + string.Join(", ", existingTags));
        Console.WriteLine("Project tags: " + string.Join(", ", projectTags));
        Console.WriteLine("intersection tags: " + string.Join(", ", intersection));

        HashSet<string> tags = new();
        // update user tags
        // add the tags that are not in the user tags, but are in the project tags
        foreach (var tag in project.Tags)
        {
            if (!existingTags.Select(x => x.Name).Contains(tag.Name))
            {
                existingTags.Add(tag);
                Console.WriteLine("Added tag: " + tag.Name);
            }
        }

        user.Tags = existingTags;

        Context.UserReviews.Add(userReview);
        Context.SaveChanges();

        return Ok();
    }
}

public class MatchedDto
{
    public int UserId { get; set; }
}

internal class DiscoveryResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string ImagePath { get; set; }
    public int UserId { get; set; }
    public string CreatorName { get; set; }
}

public class VoteDto
{
    public int UserId { get; set; }
    public int ProjectId { get; set; }
    public bool Approve { get; set; }
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

public class ProjectDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public int UserId { get; set; }
    public IFormFile Image { get; set; }
    public List<string> Tags { get; set; }
}
