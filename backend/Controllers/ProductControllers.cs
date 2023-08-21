using Mercadona.Models;
using Mercadona.Services.ProductService;
using Microsoft.AspNetCore.Mvc;

namespace Mercadona.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductControllers : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductControllers(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet("GetAll")]
        public async Task<ActionResult<ServiceResponse<List<GetProductDto>>>> Get()
        {
            return Ok(await _productService.GetAllProduct());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<List<GetProductDto>>>> GetSingle(int id)
        {
            return Ok(await _productService.GetProductById(id));
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResponse<List<GetProductDto>>>> AddProduct(AddProductDto newProduct)
        {
            return Ok(await _productService.AddProduct(newProduct));
        }

        [HttpPut]
        public async Task<ActionResult<ServiceResponse<List<GetProductDto>>>> UpdateProduct(UpdateProductDto updatedProduct)
        {
            var response = await _productService.UpdateProduct(updatedProduct);

            if (response.Data == null)
                return NotFound(response);

            return Ok(response);
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult<ServiceResponse<List<GetProductDto>>>> DeleteProduct(int id)
        {
            var response = await _productService.DeleteProduct(id);

            if (response.Data == null)
                return NotFound(response);

            return Ok(response);
        }
    }
}