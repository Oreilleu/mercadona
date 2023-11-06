using System.Text.Json.Serialization;

namespace Mercadona.Dtos.ProductDto
{
    public class GetProductDto
    {
        public int Id { get; set; } = 1;
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public string Image { get; set; } = string.Empty;

        public GetCategoryForProductDto? Category { get; set; }

        public GetPromotionDto? Promotion { get; set; }
    }
}