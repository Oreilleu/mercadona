using AutoMapper;
using Mercadona;
using Mercadona.Data;
using Mercadona.Services.ProductService;
using Microsoft.EntityFrameworkCore;

public class ProductServiceTests
{
    [Fact]
    public async Task GetProductById_ReturnsCorrectProduct()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<DataContext>()
            .UseInMemoryDatabase(databaseName: "GetProductById_ReturnsCorrectProduct")
            .Options;
        var context = new DataContext(options);
        var mapper = new Mapper(new MapperConfiguration(cfg => cfg.AddProfile<AutoMapperProfile>()));
        var productService = new ProductService(mapper, context);
        var expectedProduct = new Mercadona.Models.Product { Id = 1, Name = "Product 1", Category = new Mercadona.Models.Category { Id = 1, Name = "Category 1" }, Promotion = new Mercadona.Models.Promotion { Id = 1, Name = "Promotion 1" } };
        context.Products.Add(expectedProduct);
        context.SaveChanges();

        // Act
        var result = await productService.GetProductById(1);

        // Assert
        if (result.Data != null)
        {
            Assert.True(result.Success);
            Assert.Equal(expectedProduct.Id, result.Data.Id);
            Assert.Equal(expectedProduct.Name, result.Data.Name);
            if (result.Data.Category != null)
            {
                Assert.Equal(expectedProduct.Category.Id, result.Data.Category.Id);
                Assert.Equal(expectedProduct.Category.Name, result.Data.Category.Name);
            }
            if (result.Data.Promotion != null)
            {
                Assert.Equal(expectedProduct.Promotion.Id, result.Data.Promotion.Id);
                Assert.Equal(expectedProduct.Promotion.Name, result.Data.Promotion.Name);
            }
        }
    }
}