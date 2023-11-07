using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Mercadona.Dtos.PromotionDto
{
    public class UpdatePromotionDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string StartingDate { get; set; } = string.Empty;
        public string EndingDate { get; set; } = string.Empty;
        public int DiscountPercentage { get; set; }
    }
}