import { Module } from '@nestjs/common';
import { PlayersController } from './player.controller';
import { PlayerService } from './player.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerSchema } from './interfaces/player.schema';

@Module({
    imports: [MongooseModule.forFeature([{name: 'Player', schema: PlayerSchema}])],
    controllers: [PlayersController],
    providers: [PlayerService],
    exports: [PlayerService]
})
export class PlayerModule {}
