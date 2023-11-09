using Mercadona.Dtos.PromotionDto;
using Mercadona.Services.PromotionService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mercadona.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PromotionControllers : ControllerBase
    {
        private readonly IPromotionService _promotionService;

        public PromotionControllers(IPromotionService promotionService)
        {
            _promotionService = promotionService;
        }

        [AllowAnonymous]
        [HttpGet("GetAll")]
        public async Task<ActionResult<ServiceResponse<List<GetPromotionDto>>>> Get()
        {
            return Ok(await _promotionService.GetAllPromotion());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<List<GetPromotionDto>>>> GetSingle(int id)
        {
            return Ok(await _promotionService.GetPromotionById(id));
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResponse<List<GetPromotionDto>>>> AddPromotion(AddPromotionDto newPromotion)
        {
            return Ok(await _promotionService.AddPromotion(newPromotion));
        }

        [HttpPut]
        public async Task<ActionResult<ServiceResponse<List<GetPromotionDto>>>> UpdatePromotion(UpdatePromotionDto updatedPromotion)
        {
            var response = await _promotionService.UpdatePromotion(updatedPromotion);

            if (response.Data == null)
                return NotFound(response);

            return Ok(response);
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult<ServiceResponse<List<GetProductDto>>>> DeletePromotion(int id)
        {
            var response = await _promotionService.DeletePromotion(id);

            if (response.Data == null)
                return NotFound(response);

            return Ok(response);
        }
    }
}