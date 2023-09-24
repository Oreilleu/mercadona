using System.Text.Json.Serialization;

namespace Mercadona.Dtos.PromotionDto
{
    public class GetPromotionDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime StartingDate { get; set; } 
        public DateTime EndingDate { get; set; } 
        public int DiscountPercentage { get; set; } 
    }
}