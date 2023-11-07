using System.Text.Json.Serialization;

namespace Mercadona.Dtos.PromotionDto
{
    public class AddPromotionDto
    {
        public string Name { get; set; } = string.Empty;
        public string StartingDate { get; set; } = string.Empty;
        public string EndingDate { get; set; } = string.Empty;
        public int DiscountPercentage { get; set; }
    }
}