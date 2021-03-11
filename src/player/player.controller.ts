import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { ParamValidationPipe } from '../common/pipes/param-validation.pipe';
import { PlayerService } from './player.service';

@Controller('api/v1/player')
export class PlayersController {

    constructor(private readonly playersService: PlayerService){

    }

    @Post()
    @UsePipes(ValidationPipe)
    async create(
        @Body() createPlayerDto: CreatePlayerDto,
    ) {
        return await this.playersService.create(createPlayerDto);
    }

    @Put('/:_id')
    async update(
        @Body() createPlayerDto: CreatePlayerDto,
        @Param('_id', ParamValidationPipe) _id: string,
    ) {
        await this.playersService.update(_id,createPlayerDto);
    }

    @Get()
    async getAllPlayers(): Promise<Player[]> {
        return await this.playersService.getAllPlayers();
    }

    @Get('/:_id')
    async getPlayerbyId(
        @Param('_id', ParamValidationPipe) _id: string
    ): Promise<Player> {
        return await this.playersService.getPlayerbyId(_id);
    }

    @Delete('/:_id')
    async deletePlayer(
        @Param('_id', ParamValidationPipe) _id: string
    ): Promise<void> {
        await this.playersService.delete(_id);
    }
}
