using Mercadona.Dtos.PromotionDto;
using Mercadona.Services.PromotionService;
using Microsoft.EntityFrameworkCore;

namespace Mercadoa.Services.PromotionService
{
    public class PromotionService : IPromotionService
    {
        private readonly IMapper _mapper;
        private readonly DataContext _context;

        public PromotionService(IMapper mapper, DataContext context)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<ServiceResponse<List<GetPromotionDto>>> GetAllPromotion()
        {
            var serviceResponse = new ServiceResponse<List<GetPromotionDto>>();
            var dbPromotions = await _context.Promotions.ToListAsync();
            serviceResponse.Data = dbPromotions.Select(p => _mapper.Map<GetPromotionDto>(p)).ToList();
            return serviceResponse;
        }
        public async Task<ServiceResponse<GetPromotionByIdDto>> GetPromotionById(int id)
        {
            var serviceResponse = new ServiceResponse<GetPromotionByIdDto>();
            var dbPromotions = await _context.Promotions.FirstOrDefaultAsync(p => p.Id == id);
            serviceResponse.Data = _mapper.Map<GetPromotionByIdDto>(dbPromotions);
            return serviceResponse;
        }

        public async Task<ServiceResponse<List<GetPromotionDto>>> AddPromotion(AddPromotionDto newPromotion)
        {
            var serviceResponse = new ServiceResponse<List<GetPromotionDto>>();

            try
            {
                var promotion = _mapper.Map<Promotion>(newPromotion);
                _context.Promotions.Add(promotion);
                await _context.SaveChangesAsync();

                serviceResponse.Data =
                    await _context.Promotions.Select(p => _mapper.Map<GetPromotionDto>(p)).ToListAsync();
            }
            catch (DbUpdateException)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Une promotion avec ce nom existe déjà";
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }

            return serviceResponse;
        }
        public async Task<ServiceResponse<GetPromotionDto>> UpdatePromotion(UpdatePromotionDto updatedProduct)
        {
            var serviceResponse = new ServiceResponse<GetPromotionDto>();

            try
            {
                var promotion = await _context.Promotions.FindAsync(updatedProduct.Id);

                if (promotion is null)
                    throw new Exception($"Promotion with id {updatedProduct.Id} not found");

                promotion.Name = updatedProduct.Name;
                promotion.StartingDate = updatedProduct.StartingDate;
                promotion.EndingDate = updatedProduct.EndingDate;
                promotion.DiscountPercentage = updatedProduct.DiscountPercentage;

                await _context.SaveChangesAsync();

                serviceResponse.Data = _mapper.Map<GetPromotionDto>(promotion);
            }
            catch (DbUpdateException)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Une promotion avec ce nom existe déjà";
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }

            return serviceResponse;
        }
        public async Task<ServiceResponse<List<GetPromotionDto>>> DeletePromotion(int id)
        {
            var serviceResponse = new ServiceResponse<List<GetPromotionDto>>();

            try
            {
                var promotion = _context.Promotions.Find(id);

                if (promotion is null)
                    throw new Exception($"Promotion with id {id} not found");

                var productsToMove = _context.Products.Where(p => p.PromotionId == id).ToList();

                foreach (var product in productsToMove)
                {
                    product.PromotionId = null;
                }

                _context.Promotions.Remove(promotion);

                await _context.SaveChangesAsync();

                serviceResponse.Data =
                    await _context.Promotions.Select(p => _mapper.Map<GetPromotionDto>(p)).ToListAsync();
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