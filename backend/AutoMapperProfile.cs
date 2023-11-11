using Mercadona.Dtos.User;
using Mercadona.Dtos.UserDto;

namespace Mercadona
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Product, GetProductDto>();
            CreateMap<AddProductDto, Product>();
            CreateMap<Category, GetCategoryDto>();
            CreateMap<Category, GetCategoryByIdDto>();
            CreateMap<AddCategoryDto, Category>();
            CreateMap<Promotion, GetPromotionDto>();
            CreateMap<Promotion, GetPromotionByIdDto>();
            CreateMap<AddPromotionDto, Promotion>();
            CreateMap<Category, GetCategoryForProductDto>();
            CreateMap<User, GetAllUserDto>();
            CreateMap<User, GetUserDto>();
        }
    }
}