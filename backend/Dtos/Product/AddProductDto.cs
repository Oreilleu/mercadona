using System.Text.Json.Serialization;

namespace Mercadona.Dtos.ProductDto
{
    public class AddProductDto
    {
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public decimal Price { get; set; } 
        [JsonIgnore]
        public Category? Category { get; set; }
        public int? CategoryId { get; set; }
        [JsonIgnore]
        public Promotion? Promotion { get; set; }
        public int? PromotionId { get; set; }
    }
}