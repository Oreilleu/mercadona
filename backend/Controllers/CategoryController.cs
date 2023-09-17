using Mercadona.Services.CategoryService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;

namespace Mercadona.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }
        [AllowAnonymous]
        [HttpGet("GetAll")]
        public async Task<ActionResult<ServiceResponse<List<GetCategoryDto>>>> Get()
        {
            return Ok(await _categoryService.GetAllCategory());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<List<GetCategoryDto>>>> GetSingle(int id)
        {
            return Ok(await _categoryService.GetCategoryById(id));
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResponse<List<GetCategoryDto>>>> AddCategory(AddCategoryDto newCategory)
        {
            return Ok(await _categoryService.AddCategory(newCategory));
        }

        [HttpPut]
        public async Task<ActionResult<ServiceResponse<List<GetCategoryDto>>>> UpdateCategory(UpdateCategoryDto updatedCategory)
        {
            var response = await _categoryService.UpdateCategory(updatedCategory);

            if (response.Data == null)
                return NotFound(response);

            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ServiceResponse<List<GetCategoryDto>>>> DeleteCategory(int id)
        {
            var response = await _categoryService.DeleteCategory(id);

            if (response.Data == null)
                return NotFound(response);

            return Ok(response);
        }
    }
}