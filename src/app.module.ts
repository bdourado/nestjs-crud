import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerModule } from './player/player.module';
import { CategoryModule } from './category/category.module';
import { ChallengeModule } from './challenge/challenge.module';


@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_CONNECTION_STRING,
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
