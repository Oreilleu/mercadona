using System.Runtime.InteropServices;
using Mercadona.Dtos.CategoryDto;
using Microsoft.EntityFrameworkCore;

namespace Mercadona.Services.CategoryService
{
    public class CategoryService : ICategoryService
    {
        private readonly IMapper _mapper;
        private readonly DataContext _context;

        public CategoryService(IMapper mapper, DataContext context)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<ServiceResponse<List<GetCategoryDto>>> GetAllCategory()
        {
            var serviceResponse = new ServiceResponse<List<GetCategoryDto>>();
            var dbCategories = await _context.Categories.ToListAsync();
            serviceResponse.Data = dbCategories.Select(p => _mapper.Map<GetCategoryDto>(p)).ToList();
            return serviceResponse;
        }

        public async Task<ServiceResponse<GetCategoryByIdDto>> GetCategoryById(int id)
        {
            var serviceResponse = new ServiceResponse<GetCategoryByIdDto>();
            var dbCategories = await _context.Categories.FirstOrDefaultAsync(p => p.Id == id);
            serviceResponse.Data = _mapper.Map<GetCategoryByIdDto>(dbCategories);
            return serviceResponse;
        }
        public async Task<ServiceResponse<List<GetCategoryDto>>> AddCategory(AddCategoryDto newCategory)
        {
            var serviceResponse = new ServiceResponse<List<GetCategoryDto>>();

            try
            {
                var category = _mapper.Map<Category>(newCategory);
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                serviceResponse.Data =
                    await _context.Categories.Select(p => _mapper.Map<GetCategoryDto>(p)).ToListAsync();
            }
            catch (DbUpdateException) 
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Une catégorie avec ce nom existe déjà";
            }
            catch(Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }

            return serviceResponse;
        }


        public async Task<ServiceResponse<GetCategoryDto>> UpdateCategory(UpdateCategoryDto updatedCategory)
        {
            var serviceResponse = new ServiceResponse<GetCategoryDto>();

            try
            {
                var category = await _context.Categories.FindAsync(updatedCategory.Id);
                
                if(category is null)
                    throw new Exception($"Category with id {updatedCategory.Id} not found");
                
                if(category.Name == "Autre")
                    throw new Exception("Impossible de modifier la catégorie 'Autre'");

                category.Name = updatedCategory.Name;

                await _context.SaveChangesAsync();

                serviceResponse.Data = _mapper.Map<GetCategoryDto>(category);
            }
            catch (DbUpdateException)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Une catégorie avec ce nom existe déjà";
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }

            return serviceResponse;
        }
        public async Task<ServiceResponse<List<GetCategoryDto>>> DeleteCategory(int id)
        {
            var serviceResponse = new ServiceResponse<List<GetCategoryDto>>();

            try
            {
                var category = _context.Categories.FirstOrDefault(p => p.Id == id);

                if(category is null)
                    throw new Exception($"Category with id {id} not found");
                
                if(category.Name == "Autre")
                    throw new Exception("Impossible de supprimer la catégorie 'Autre'");

                _context.Categories.Remove(category);

                await _context.SaveChangesAsync();

                serviceResponse.Data = await _context.Categories.Select(p => _mapper.Map<GetCategoryDto>(p)).ToListAsync();
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }

            return serviceResponse;
        }
    }
}