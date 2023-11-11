using AutoMapper;
using Mercadoa.Services.PromotionService;
using Mercadona;
using Mercadona.Data;
using Mercadona.Models;
using Microsoft.EntityFrameworkCore;

public class PromotionServiceTests
{
    private readonly IMapper _mapper;

    public PromotionServiceTests()
    {
        // Initialize AutoMapper for testing
        var config = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<AutoMapperProfile>();
        });
        _mapper = config.CreateMapper();
    }

    [Fact]
    public async Task DeletePromotion_WithValidId_ShouldRemovePromotionAndSetProductPromotionIdToNull()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<DataContext>()
            .UseInMemoryDatabase(databaseName: "DeletePromotionTestDatabase")
            .Options;
        using (var context = new DataContext(options))
        {
            // Seed the database with test data
            var promotion = new Mercadona.Models.Promotion { Id = 1, Name = "Test Promotion" };
            var product1 = new Mercadona.Models.Product { Id = 1, Name = "Test Product 1", PromotionId = 1 };
            var product2 = new Product { Id = 2, Name = "Test Product 2", PromotionId = 1 };
            context.Promotions.Add(promotion);
            context.Products.AddRange(product1, product2);
            context.SaveChanges();

            var service = new PromotionService(_mapper, context);

            // Act
            var result = await service.DeletePromotion(1);

            // Assert
            Assert.True(result.Success);

            var promotions = await context.Promotions.ToListAsync();
            Assert.Empty(promotions);

            var products = await context.Products.ToListAsync();
            Assert.Equal(2, products.Count);
            Assert.Null(products[0].PromotionId);
            Assert.Null(products[1].PromotionId);
        }
    }

}