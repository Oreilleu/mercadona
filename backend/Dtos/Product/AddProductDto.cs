using System.Text.Json.Serialization;

namespace Mercadona.Dtos.Product
{
    public class AddProductDto
    {
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public decimal Price { get; set; } 
        [JsonIgnore]
        public Category? Category { get; set; }
        public int CategoryId { get; set; }
    }
}