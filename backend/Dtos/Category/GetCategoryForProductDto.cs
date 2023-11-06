using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;

namespace Mercadona.Dtos.CategoryDto
{
    public class GetCategoryForProductDto
    {
        public int Id { get; set; } = 1;
        public string Name { get; set; } = string.Empty;
    }
}