using System.ComponentModel.DataAnnotations.Schema;

namespace Mercadona.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public string ImageUrl { get; set; } = string.Empty;

        [ForeignKey("Category")]
        public int CategoryId { get; set; }

        public Category? Category { get; set; }

        [ForeignKey("Promotion")]
        public int? PromotionId { get; set; }
        public Promotion? Promotion { get; set; }

    }
}