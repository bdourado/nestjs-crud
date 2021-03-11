import { IsOptional } from "class-validator";
import { challengeStatus } from "../interfaces/challenge-status.enum";


export class UpdateChallengeDto {

    @IsOptional()
    challengeDateTime: Date;
  
    @IsOptional()
    status: challengeStatus;
  
  

}
