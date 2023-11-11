namespace Mercadona.Dtos.UserDto
{
    public class GetAllUserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public bool IsInitialAccount { get; set; }
    }
}