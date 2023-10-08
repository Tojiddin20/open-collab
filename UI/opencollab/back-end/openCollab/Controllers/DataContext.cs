using Microsoft.EntityFrameworkCore;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Email { get;  set; }
    public string Password { get;  set; }
}

public class Project
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string ImagePath { get; set; }

    public int UserId { get; set; }
    public virtual User User { get; set; } = null!;
}


public class DataContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Project> Projects { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source=app.db");
}
