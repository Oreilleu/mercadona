using Mercadona.Dtos.PromotionDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mercadona.Services.PromotionService
{
    public interface IPromotionService
    {
        Task<ServiceResponse<List<GetPromotionDto>>> GetAllPromotion();
        Task<ServiceResponse<GetPromotionByIdDto>> GetPromotionById(int id);
        Task<ServiceResponse<List<GetPromotionDto>>> AddPromotion(AddPromotionDto newPromotion);
        Task<ServiceResponse<GetPromotionDto>> UpdatePromotion(UpdatePromotionDto updatedProduct);
        Task<ServiceResponse<List<GetPromotionDto>>> DeletePromotion(int id);

    }
}