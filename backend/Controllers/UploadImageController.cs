using Mercadona.Models;
using Mercadona.Services.ProductService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mercadona.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class UploadImageController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UploadImageController(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResponse<GetProductDto>>> Upload([FromForm] IFormFile imagefile, [FromForm] int idProduct)
        {
            var serviceResponse = new ServiceResponse<List<GetProductDto>>();

            if (imagefile is null)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Pas d'image envoyée";
                return BadRequest(serviceResponse);
            }

            var product = await _context.Products.FindAsync(idProduct);

            if (product is null)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = $"Produit {idProduct} non trouvé";
                return BadRequest(serviceResponse);
            }

            string uploadDirectory = Path.Combine("wwwroot", "images");

            if (!Directory.Exists(uploadDirectory))
            {
                Directory.CreateDirectory(uploadDirectory);
            }

            string uniqueFileName = Guid.NewGuid() + "_" + imagefile.FileName;

            string uploadPath = Path.Combine(uploadDirectory, uniqueFileName);

            using (var stream = new FileStream(uploadPath, FileMode.Create))
            {
                await imagefile.CopyToAsync(stream);
            }

            product.ImageUrl = $"https://localhost:7208/images/{uniqueFileName}";

            await _context.SaveChangesAsync();

            serviceResponse.Success = true;
            serviceResponse.Data = new List<GetProductDto> { _mapper.Map<GetProductDto>(product) };

            return Ok(serviceResponse);
        }
    }
}