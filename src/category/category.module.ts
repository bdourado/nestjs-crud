import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerModule } from 'src/player/player.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategorySchema } from './interfaces/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Category', schema: CategorySchema}]),
    PlayerModule
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService]
})
export class CategoryModule {}
