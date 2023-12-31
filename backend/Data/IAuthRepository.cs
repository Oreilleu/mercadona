using Mercadona.Dtos.User;
using Mercadona.Dtos.UserDto;

namespace Mercadona.Data
{
    public interface IAuthRepository
    {
        Task<ServiceResponse<List<GetAllUserDto>>> GetAllUsers();
        Task<ServiceResponse<int>> Register(User user, string password);
        Task<ServiceResponse<string>> Login(string username, string password);
        Task<ServiceResponse<List<GetUserDto>>> DeleteUser(int id);
        Task<bool> UserExists(string username);
        Task<ServiceResponse<bool>> VerifyToken(string token);
    }
}