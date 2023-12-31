using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;

namespace Mercadona.Dtos.CategoryDto
{
    public class GetCategoryDto
    {
        public int Id { get; set; } = 1;
        public string Name { get; set; } = string.Empty;
        public List<GetProductDto>? Products { get; set; }
    }
}