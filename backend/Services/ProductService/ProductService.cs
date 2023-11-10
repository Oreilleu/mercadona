global using AutoMapper;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace Mercadona.Services.ProductService
{
    public class ProductService : IProductService
    {

        private readonly IMapper _mapper;
        private readonly DataContext _context;
        public ProductService(IMapper mapper, DataContext context)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<List<GetProductDto>>> GetAllProduct()
        {
            var serviceResponse = new ServiceResponse<List<GetProductDto>>();
            var dbProducts = await _context.Products.Include(p => p.Category).Include(p => p.Promotion).ToListAsync();
            serviceResponse.Data = dbProducts.Select(p => _mapper.Map<GetProductDto>(p)).ToList();
            return serviceResponse;
        }

        public async Task<ServiceResponse<GetProductDto>> GetProductById(int id)
        {
            var serviceResponse = new ServiceResponse<GetProductDto>();
            var dbProducts = await _context.Products.Include(p => p.Category).Include(p => p.Promotion).FirstOrDefaultAsync(p => p.Id == id);
            serviceResponse.Data = _mapper.Map<GetProductDto>(dbProducts);
            return serviceResponse;

        }

        public async Task<ServiceResponse<List<GetProductDto>>> AddProduct(AddProductDto newProduct)
        {
            var serviceResponse = new ServiceResponse<List<GetProductDto>>();

            try
            {
                var category = await _context.Categories.FindAsync(newProduct.CategoryId);

                if (category is null)
                {
                    category = await _context.Categories.SingleOrDefaultAsync(c => c.Name == "Autre");

                    if (category is null)
                    {
                        category = new Category { Name = "Autre" };
                        _context.Categories.Add(category);
                        await _context.SaveChangesAsync();
                    }
                }


                var product = _mapper.Map<Product>(newProduct);

                var promotion = await _context.Promotions.FindAsync(newProduct.PromotionId);

                if (promotion is null)
                {
                    product.Promotion = null;
                }

                product.Category = category;
                product.Promotion = promotion;

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                serviceResponse.Data =
                    await _context.Products.Select(p => _mapper.Map<GetProductDto>(p)).ToListAsync();

            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }

            return serviceResponse;
        }

        public async Task<ServiceResponse<GetProductDto>> UpdateProduct(UpdateProductDto updatedProduct)
        {
            var serviceResponse = new ServiceResponse<GetProductDto>();

            try
            {
                var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == updatedProduct.Id);
                var category = await _context.Categories.FindAsync(updatedProduct.CategoryId);


                if (product is null)
                    throw new Exception($"Product with id {updatedProduct.Id} not found");


                if (category is null)
                {
                    category = await _context.Categories.SingleOrDefaultAsync(c => c.Name == "Autre");

                    if (category is null)
                    {
                        category = new Category { Name = "Autre" };
                        _context.Categories.Add(category);
                        await _context.SaveChangesAsync();
                    }
                }

                var promotion = await _context.Promotions.FindAsync(updatedProduct.PromotionId);

                product.Name = updatedProduct.Name;
                product.Description = updatedProduct.Description;
                product.Price = updatedProduct.Price;
                product.Category = category;
                product.PromotionId = promotion?.Id;

                await _context.SaveChangesAsync();
                serviceResponse.Data = _mapper.Map<GetProductDto>(product);
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }

            return serviceResponse;
        }

        public async Task<ServiceResponse<List<GetProductDto>>> DeleteProduct(int id)
        {
            var serviceResponse = new ServiceResponse<List<GetProductDto>>();

            try
            {

                var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);

                if (product == null)
                    throw new Exception($"Product with id {id} not found");

                string deletePath = Path.Combine("wwwroot/images", product.ImageUrl.Split('/').Last());
                if (deletePath is null)
                {
                    throw new Exception($"Image with id {id} not found");
                }
                File.Delete(deletePath);

                _context.Products.Remove(product);

                await _context.SaveChangesAsync();

                serviceResponse.Data = await _context.Products.Select(p => _mapper.Map<GetProductDto>(p)).ToListAsync();
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }

            return serviceResponse;
        }
    }
}