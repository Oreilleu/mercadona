using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace Mercadona.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<Product>? Products { get; set; }
    }

}