import { IsNotEmpty } from 'class-validator';
import { Result } from '../interfaces/challenge.interface';
import { Player } from '../../player/interfaces/player.interface'


export class AddMatchToChallengeDto {

  @IsNotEmpty()
  def: Player

  @IsNotEmpty()
  result: Array<Result>
  
}
