namespace Mercadona.Dtos.CategoryDto
{
    public class GetCategoryByIdDto
    {
        public int Id { get; set; } = 1;
        public string Name { get; set; } = string.Empty;
        public List<Product>? Products { get; set; }
    }
}