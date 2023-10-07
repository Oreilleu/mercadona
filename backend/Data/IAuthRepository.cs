using Mercadona.Dtos.User;

namespace Mercadona.Data
{
    public interface IAuthRepository
    {
        Task<ServiceResponse<int>> Register(User user, string password);
        Task<ServiceResponse<string>> Login(string username, string password);
        // Task<ServiceResponse<GetUserDto>> UpdateUser(UserUpdateDto updatedUser);
        Task<ServiceResponse<List<GetUserDto>>> DeleteUser(int id);
        Task<bool> UserExists(string username);
    }
}