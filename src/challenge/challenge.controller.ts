import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { AddMatchToChallengeDto } from './dtos/add-match-to-challenge.dto';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe';

@Controller('api/v1/challenge')
export class ChallengeController {

    constructor(private readonly challengeService: ChallengeService) {}

    private readonly logger = new Logger(ChallengeController.name)

    @Post()
    @UsePipes(ValidationPipe)
    async create(
        @Body() createChallengeDto: CreateChallengeDto): Promise<Challenge> {
            this.logger.log(`createChallengeDto: ${JSON.stringify(createChallengeDto)}`);
            return await this.challengeService.create(createChallengeDto);
    }

    @Get()
    async getPlayerChallenges(
        @Query('playerId')  _id: string): Promise<Array<Challenge>> {
        return _id ? await this.challengeService.getPlayerChallenges(_id) : await this.challengeService.getAllChallenges();
    }

    @Put('/:challenge')
    async update(
        @Body(ChallengeStatusValidationPipe) updateChallengeDto: UpdateChallengeDto,
        @Param('challenge') _id: string): Promise<void> {
            await this.challengeService.update(_id, updateChallengeDto)

        }    

    @Post('/:challenge/match/')
    async addMatchToChallengeDto(
        @Body(ValidationPipe) addMatchToChallengeDto: AddMatchToChallengeDto,
        @Param('challenge') _id: string): Promise<void> {
        return await this.challengeService.addMatchToChallengeDto(_id, addMatchToChallengeDto);        
    }

    @Delete('/:_id')
    async delete(
        @Param('_id') _id: string): Promise<void> {
            await this.challengeService.delete(_id);
    }

}
