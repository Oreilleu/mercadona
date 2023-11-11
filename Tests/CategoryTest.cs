
using AutoMapper;
using Mercadona;
using Mercadona.Data;
using Mercadona.Dtos.CategoryDto;
using Mercadona.Models;
using Mercadona.Services.CategoryService;
using Microsoft.EntityFrameworkCore;

namespace Tests
{

    public class CategoryTest
    {
        [Fact]
        public async Task GetAllCategory_ReturnsListOfCategories()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase(databaseName: "TestDb")
                .Options;
            var dbContext = new DataContext(options);
            var mapper = new Mapper(new MapperConfiguration(cfg => cfg.AddProfile<AutoMapperProfile>()));
            var categoryService = new CategoryService(mapper, dbContext);

            var categories = new List<Category>
            {
                new Category { Name = "Category 1" },
                new Category { Name = "Category 2" },
                new Category { Name = "Category 3" }
            };
            await dbContext.Categories.AddRangeAsync(categories);
            await dbContext.SaveChangesAsync();

            var result = await categoryService.GetAllCategory();

            Assert.NotNull(result);
            Assert.IsType<ServiceResponse<List<GetCategoryDto>>>(result);
            if (result.Data != null)
            {
                Assert.Equal(categories.Count, result.Data.Count);
                foreach (var category in categories)
                {
                    Assert.Contains(result.Data, c => c.Name == category.Name);
                }
            }
        }
    }
}