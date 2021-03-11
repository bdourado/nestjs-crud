import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './interfaces/category.interface';

@Controller('api/v1/category')
export class CategoryController {

    constructor(private readonly categoryService: CategoryService){}

    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
        return await this.categoryService.create(createCategoryDto);
    }

    @Get()
    async getAllCategories(): Promise<Array<Category>> {
        return await this.categoryService.getAllCategories()
    }

    @Get('/:category')
    async getCategoryById(
        @Param('category') category: string): Promise<Category> {
            return await this.categoryService.getCategoryById(category);
        }

    @Put('/:categoria')
    @UsePipes(ValidationPipe)    
    async update(
        @Body() updateCategoryDto: UpdateCategoryDto,
        @Param('categoria') category: string): Promise<void> {
            await this.categoryService.update(category, updateCategoryDto);
        }    

   @Post('/:category/player/:playerId')
   async addPlayerToCategory(
       @Param() params: string[]): Promise<void> {
        return await this.categoryService.addPlayerToCategory(params);
           
   }

}
