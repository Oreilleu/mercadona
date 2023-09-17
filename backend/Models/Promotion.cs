using System.Text.Json.Serialization;
using Microsoft.Identity.Client;

namespace Mercadona.Models
{
    public class Promotion
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime StartingDate { get; set; } 
        public DateTime EndingDate { get; set; } 
        public int DiscountPercentage { get; set; } 
    }

}