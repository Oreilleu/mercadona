namespace Mercadona.Dtos.Product
{
    public class GetProductDto
    {
        public int Id { get; set; } = 1;
        public string Name { get; set; } = "chaussure";

        public string Description { get; set; } = "Belle chausssure rouge";

        public decimal Price { get; set; } = 10;

        public CategoryClass Class { get; set; } = CategoryClass.Clothe;


    }
}