import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayerService {

    constructor(@InjectModel('Player') private readonly playerModel: Model<Player>) {}

    async getAllPlayers(): Promise<Player[]> {
        return await this.playerModel.find().exec();
    }

    async getPlayerbyId(_id: string): Promise<Player> {
        const playerFound = await this.playerModel.findOne({_id}).exec();
        if (!playerFound) {
            throw new NotFoundException(`Player with id ${_id} was not found!`);
        }
        return playerFound;
    }

    async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
        const { email } = createPlayerDto;
        
        const playerfound = await this.playerModel.findOne({ email }).exec();

        if (playerfound) {
            throw new BadRequestException(`Player with emai ${email} is already registered!`)
        }

        const createdPlayer = new this.playerModel(createPlayerDto);
        return await createdPlayer.save();
    }

    async update(_id: String, createPlayerDto: CreatePlayerDto): Promise<void> {
        const playerfound = await this.playerModel.findById(_id).exec();
        
        if (!playerfound) {
            throw new NotFoundException(`Player with id ${_id} was not found!`);
        }

        await this.playerModel.findByIdAndUpdate(_id, {$set: createPlayerDto }).exec();
    }

    async delete(_id: string): Promise<void> {
        const playerfound = await this.playerModel.findById(_id).exec();
        
        if (!playerfound) {
            throw new NotFoundException(`Player with id ${_id} was not found!`);
        }

        await this.playerModel.findByIdAndDelete({_id}).exec();
    }
}
