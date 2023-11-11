using System;
using System.Threading.Tasks;
using AutoMapper;
using Mercadona.Data;
using Mercadona.Dtos.ProductDto;
using Mercadona.Services.ProductService;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Mercadona.API.Tests.Services
{
    public class ProductServiceTests
    {
        private readonly IMapper _mapper;

        public ProductServiceTests()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<AutoMapperProfile>();
            });

            _mapper = config.CreateMapper();
        }

        [Fact]
        public async Task UpdateProduct_WithValidData_ShouldUpdateProduct()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase(databaseName: "UpdateProduct_WithValidData_ShouldUpdateProduct")
                .Options;

            using (var context = new DataContext(options))
            {
                var category = new Models.Category { Name = "Test Category" };
                await context.Categories.AddAsync(category);
                await context.SaveChangesAsync();

                var product = new Models.Product
                {
                    Name = "Test Product",
                    Description = "Test Description",
                    Price = 10.0m,
                    Category = category
                };

                await context.Products.AddAsync(product);
                await context.SaveChangesAsync();

                var updatedProduct = new UpdateProductDto
                {
                    Id = product.Id,
                    Name = "Updated Test Product",
                    Description = "Updated Test Description",
                    Price = 20.0m,
                    CategoryId = category.Id
                };

                var service = new ProductService(_mapper, context);

                // Act
                var result = await service.UpdateProduct(updatedProduct);

                // Assert
                Assert.True(result.Success);
                Assert.Equal("Updated Test Product", result.Data?.Name);
                Assert.Equal("Updated Test Description", result.Data?.Description);
                Assert.Equal(20.0m, result.Data?.Price);
                Assert.NotNull(result.Data?.Category);
                Assert.NotNull(category);
                Assert.Equal(category?.Id, result.Data?.Category?.Id);
            }
        }



        [Fact]
        public async Task UpdateProduct_WithInvalidCategoryId_ShouldCreateNewCategory()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase(databaseName: "UpdateProduct_WithInvalidCategoryId_ShouldCreateNewCategory")
                .Options;

            using (var context = new DataContext(options))
            {
                var product = new Models.Product
                {
                    Name = "Test Product",
                    Description = "Test Description",
                    Price = 10.0m
                };

                await context.Products.AddAsync(product);
                await context.SaveChangesAsync();

                var updatedProduct = new UpdateProductDto
                {
                    Id = product.Id,
                    Name = "Updated Test Product",
                    Description = "Updated Test Description",
                    Price = 20.0m,
                    CategoryId = 1
                };

                var service = new ProductService(_mapper, context);

                // Act
                var result = await service.UpdateProduct(updatedProduct);

                // Assert
                Assert.True(result.Success);
                Assert.Equal("Updated Test Product", result.Data?.Name);
                Assert.Equal("Updated Test Description", result.Data?.Description);
                Assert.Equal(20.0m, result.Data?.Price);
                Assert.NotNull(result.Data?.Category);
                if (result.Data?.Category != null)
                {
                    Assert.Equal("Autre", result.Data.Category.Name);
                }
            }
        }
    }
}