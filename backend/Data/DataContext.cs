using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Mercadona.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }


        public DbSet<Product> Products => Set<Product>();
        public DbSet<User> Users => Set<User>();

        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Promotion> Promotions => Set<Promotion>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuration de l'index unique sur la colonne "Name" de l'entité "Category"
            modelBuilder.Entity<Category>()
                .HasIndex(c => c.Name)
                .IsUnique();
            
            // Configuration de l'index unique sur la colonne "Name" de l'entité "Promotion"
            modelBuilder.Entity<Promotion>()
                .HasIndex(c => c.Name)
                .IsUnique();
        }
    }
}