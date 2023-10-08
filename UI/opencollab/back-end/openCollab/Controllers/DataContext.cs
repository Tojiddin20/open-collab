using Microsoft.EntityFrameworkCore;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Email { get;  set; }
    public string Password { get;  set; }

    public virtual List<Tag> Tags { get; set; }
}

public class Tag
{
    public int Id { get; set; }

    public string Name { get; set; }

    public virtual List<User> Users { get; set; }
    public virtual List<Project> Projects { get; set; }
}

public class Project
{
    public virtual List<UserReview> UserReviews { get; set; }

    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string ImagePath { get; set; }

    public int UserId { get; set; }
    public virtual User User { get; set; } = null!;

    public virtual List<Tag> Tags { get; set; }
}

public class UserReview
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public virtual User User { get; set; }

    public int ProjectId { get; set; }
    public virtual Project Project { get; set; }

    public bool Approved { get; set; }
}

public class DataContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<UserReview> UserReviews { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source=app.db");
}
