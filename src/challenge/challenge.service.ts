import { Injectable, NotFoundException, BadRequestException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Challenge, Match } from './interfaces/challenge.interface';
import { Model } from 'mongoose';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { challengeStatus } from './interfaces/challenge-status.enum';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { PlayerService } from 'src/player/player.service';
import { CategoryService } from 'src/category/category.service';
import { AddMatchToChallengeDto } from './dtos/add-match-to-challenge.dto';

@Injectable()
export class ChallengeService {

    constructor(
        @InjectModel('challenge') private readonly challengeModel: Model<Challenge>,
        @InjectModel('match') private readonly matchModel: Model<Match>,
        private readonly playerService: PlayerService,
        private readonly categoryService: CategoryService) {}

        private readonly logger = new Logger(ChallengeService.name)

    async create(createChallengeDto: CreateChallengeDto): Promise<Challenge> {
        
        const players = await this.playerService.getAllPlayers();

        createChallengeDto.players.map(playerDto => {
            const playerFilter = players.filter( player => player._id == playerDto._id );

            if (playerFilter.length == 0) {
                throw new BadRequestException(`The id ${playerDto._id} is not a player!`);
            }
        
        });

        const isTheRequstingPlayerInTheMatch = createChallengeDto.players.filter(player => player._id === createChallengeDto.requester);

        this.logger.log(`is The Requesting Player In The Match: ${isTheRequstingPlayerInTheMatch}`);

        if(isTheRequstingPlayerInTheMatch.length == 0) {
            throw new BadRequestException(`The Requester must be a Match player!`);
        }

        const playerCategory = await this.categoryService.getPlayerCategory(createChallengeDto.requester);

        if (!playerCategory) {
            throw new BadRequestException(`The requester must be registered in a category!`);
        }

        const createdChallenge = new this.challengeModel(createChallengeDto);
        createdChallenge.category = playerCategory.category;
        createdChallenge.requestDateTime = new Date();

        createdChallenge.status = challengeStatus.PENDING;
        this.logger.log(`Challenge Created: ${JSON.stringify(createdChallenge)}`);
        return await createdChallenge.save();

    }

    async getAllChallenges(): Promise<Array<Challenge>> {
        return await this.challengeModel.find()
            .populate("requester")
            .populate("players")
            .exec();
    }

    async getPlayerChallenges(_id: any): Promise<Array<Challenge>> {

        const player = await this.playerService.getPlayerbyId(_id);

        if (!player) {
            throw new NotFoundException(`The id ${_id} is not a player!`);
        }

        return await this.challengeModel.find()
            .where('players')
            .in(_id)
            .populate("requester")
            .populate("players")
            .exec();
    }

    async update(_id: string, updateChallengeDto: UpdateChallengeDto): Promise<void> {
   
        const challengeFound = await this.challengeModel.findById(_id).exec();

        if (!challengeFound) {
            throw new NotFoundException(`The challenge ${_id} was not found!`);
        }

        if (challengeFound.status){
            challengeFound.responseDateTime = new Date();    
        }

        challengeFound.status = updateChallengeDto.status
        challengeFound.challengeDateTine = updateChallengeDto.challengeDateTime;

        await this.challengeModel.findOneAndUpdate({_id},{$set: challengeFound}).exec();
        
    }

    async addMatchToChallengeDto(_id: string, addMatchToChallengeDto: AddMatchToChallengeDto ): Promise<void> {

        const challengeFound = await this.challengeModel.findById(_id).exec();

        console.log(challengeFound.players)
        
        if (!challengeFound) {
            throw new BadRequestException(`challenge ${_id} was not found!`)
        }

        const playerFilter = challengeFound.players.filter( player => player._id == addMatchToChallengeDto.def )

        this.logger.log(`challengeFound: ${challengeFound}`);
        this.logger.log(`playerFiltered: ${playerFilter}`);

        if (playerFilter.length === 0) {
            throw new BadRequestException(`The winning player is not part of the challenge!`);
        }

        const createdMatch = new this.matchModel(addMatchToChallengeDto);

        createdMatch.category = challengeFound.category;

        createdMatch.players = challengeFound.players;

        const result = await createdMatch.save();

        challengeFound.status = challengeStatus.DONE;

        challengeFound.match = result._id;

        try {
            await this.challengeModel.findOneAndUpdate({_id},{$set: challengeFound}).exec() 
        } catch (error) {
           await this.matchModel.deleteOne({_id: result._id}).exec();
           throw new InternalServerErrorException();
        }
    }

    async delete(_id: string): Promise<void> {

        const challengeFound = await this.challengeModel.findById(_id).exec();

        if (!challengeFound) {
            throw new BadRequestException(`Challenge ${_id}not found!`);
        }
    
        challengeFound.status = challengeStatus.CANCELED;

       await this.challengeModel.findOneAndUpdate({_id},{$set: challengeFound}).exec();

    }

}
