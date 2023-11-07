using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.Identity.Client;

namespace Mercadona.Models
{
    public class Promotion
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string StartingDate { get; set; } = string.Empty;
        public string EndingDate { get; set; } = string.Empty;
        public List<Product>? Products { get; set; }
        public int DiscountPercentage { get; set; }
    }

}