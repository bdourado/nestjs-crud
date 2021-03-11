import { PipeTransform, BadRequestException } from '@nestjs/common';
import { challengeStatus } from '../interfaces/challenge-status.enum';

export class ChallengeStatusValidationPipe implements PipeTransform {
    readonly allowedStatus = [
        challengeStatus.ACCEPTED,
        challengeStatus.REJECTED,
        challengeStatus.CANCELED
    ];

    transform(value: any) {
        const status = value.status.toUpperCase();

        if (!this.isValidStatus(status)) {
            throw new BadRequestException(`${status} is not a valid status!`);
        }

        return value;
    }

    private isValidStatus(status: any) {
        const idx = this.allowedStatus.indexOf(status);
        return idx !== -1;
    }
}
