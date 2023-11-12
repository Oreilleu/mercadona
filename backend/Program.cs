global using Mercadona.Models;
global using Mercadona.Services.ProductService;
global using Mercadona.Dtos.ProductDto;
global using Mercadona.Dtos.CategoryDto;
global using Mercadona.Dtos.PromotionDto;
global using Mercadona.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.Filters;
using Microsoft.OpenApi.Models;
using Mercadona.Services.CategoryService;
using Mercadona.Services.PromotionService;
using Mercadoa.Services.PromotionService;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

var defaultConnectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");
defaultConnectionString ??= builder.Configuration.GetConnectionString("DefaultConnection");

var secretToken = Environment.GetEnvironmentVariable("SecretToken");
secretToken ??= builder.Configuration.GetSection("AppSettings:Token").Value;


builder.Services.AddCors(options =>
{
    options.AddPolicy("CORS", policy =>
                      {
                          policy.WithOrigins("*").AllowAnyHeader().AllowAnyMethod();
                      });
});

// Add services to the container.
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseNpgsql(defaultConnectionString);
});
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Description = """ Standard Authorization header using  the Bearer scheme. Example : "bearer {token}" """,
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    c.OperationFilter<SecurityRequirementsOperationFilter>();
});

builder.Services.AddAutoMapper(typeof(Program).Assembly);
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IPromotionService, PromotionService>();
if (string.IsNullOrEmpty(secretToken))
{
    throw new InvalidOperationException("La clé secrète du token JWT n'est pas définie.");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8
            .GetBytes(secretToken)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<DataContext>();

    context.Database.EnsureCreated();

    if (!context.Categories.Any())
    {
        context.Categories.Add(new Category { Name = "Autre" });
        context.SaveChanges();
    }

    if (!context.Users.Any())
    {
        var authRepository = services.GetRequiredService<IAuthRepository>();
        var userService = services.GetRequiredService<IAuthRepository>();

        var defaultAccount = Environment.GetEnvironmentVariable("DefaultAccount");


        var defaultUsername = "admin";
        var defaultPassword = defaultAccount;
        if (!await authRepository.UserExists(defaultUsername))
        {
            var newUser = new User { Username = defaultUsername, IsInitialAccount = true };
            if (defaultPassword != null)
            {
                var registrationResult = await authRepository.Register(newUser, defaultPassword);

                if (registrationResult.Success)
                {
                    Console.WriteLine($"User created");
                }
                else
                {
                    Console.WriteLine($"Failed to create user: {registrationResult.Message}");
                }
            }
            else
            {
                Console.WriteLine($"Failed to create user: default password is null");
            }
        }
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseCors("CORS");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
