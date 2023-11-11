using Mercadona.Dtos.User;
using Mercadona.Dtos.UserDto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mercadona.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepo;

        public AuthController(IAuthRepository authRepo)
        {
            _authRepo = authRepo;
        }


        [HttpGet("GetAll")]
        public async Task<ActionResult<ServiceResponse<List<GetAllUserDto>>>> GetAll()
        {
            var response = await _authRepo.GetAllUsers();

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [AllowAnonymous]
        [HttpPost("Register")]
        public async Task<ActionResult<ServiceResponse<int>>> Register(UserRegisterDto request)
        {
            var response = await _authRepo.Register(
                new User { Username = request.Username }, request.Password
            );

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<ActionResult<ServiceResponse<int>>> Login(UserLoginDto request)
        {
            var response = await _authRepo.Login(request.Username, request.Password);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ServiceResponse<GetUserDto>>> Delete(int id)
        {
            var response = await _authRepo.DeleteUser(id);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [AllowAnonymous]
        [HttpPost("verifytoken")]
        public async Task<ActionResult<ServiceResponse<bool>>> VerifyToken([FromBody] string token)
        {
            var response = await _authRepo.VerifyToken(token);

            return Ok(response);
        }
    }
}