import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerModule } from './player/player.module';
import { CategoryModule } from './category/category.module';
import { ChallengeModule } from './challenge/challenge.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://admin:HNe4Q!BYx!5AiNy@cluster0.r56hi.mongodb.net/smart-ranking?retryWrites=true&w=majority`,
      { useNewUrlParser:true, useCreateIndex:true, useFindAndModify:false }
    ),
    PlayerModule,
    CategoryModule,
    ChallengeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
