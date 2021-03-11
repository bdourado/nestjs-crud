import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayerService } from 'src/player/player.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoryService {

    constructor(
        @InjectModel('Category') private readonly categoryModel: Model<Category>,
        private readonly playerService: PlayerService        
    ){}

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {

        const { category } = createCategoryDto;

        const categoryfound = await this.categoryModel.findOne({category}).exec();

        if (categoryfound) {
            throw new BadRequestException(`Category ${category} is already registered!`);
        }
        
        const createdCategory = new this.categoryModel(createCategoryDto);
        return await createdCategory.save();
    }

    async getAllCategories(): Promise<Array<Category>> {
        return await this.categoryModel.find().populate("Players").exec();
    }

    async getCategoryById(category: string): Promise<Category> {

        const categoryFound = await this.categoryModel.findOne({category}).exec();

        if(!categoryFound) {
            throw new NotFoundException(`Category ${category} was not found!`);
        }

        return categoryFound;
    }

    async update(category: string, updateCategoryDto: UpdateCategoryDto): Promise<void> {
   
        const categoryFound = await this.categoryModel.findOne({category}).exec();

        if (!categoryFound) {
            throw new NotFoundException(`Category ${category} was not found!`);
        }

        await this.categoryModel.findOneAndUpdate({category},{$set: updateCategoryDto}).exec();
    }

    async addPlayerToCategory(params: string[]): Promise<void> {

        const category = params['category'];
        const playerId = params['playerId'];

        const categoryFound = await this.categoryModel.findOne({category}).exec();
        const categoryPlayerFound = await this.categoryModel.find({category}).where('players').in(playerId).exec();

        await this.playerService.getPlayerbyId(playerId);
        
        if (!categoryFound) {
            throw new BadRequestException(`Category ${category} not found!`);
        }

        if(categoryPlayerFound.length > 0) {
            throw new BadRequestException(`Player ${playerId} is already registered in ${category}!`);
        }

        categoryFound.players.push(playerId);
        await this.categoryModel.findOneAndUpdate({category},{$set: categoryFound}).exec();

    }

    async getPlayerCategory(playerId: any): Promise<Category> {                              

       const player = await this.playerService.getPlayerbyId(playerId);

       if (!player) {
           throw new BadRequestException(`the id ${playerId} is not a player!`)
       }

        return await this.categoryModel.findOne().where('players').in(playerId).exec();

    }


}
