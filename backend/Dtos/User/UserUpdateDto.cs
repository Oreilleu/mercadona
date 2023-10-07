namespace Mercadona.Dtos.User
{
    public class UserUpdateDto
    {
        public int Id { get; set;}
        public string Username  { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}