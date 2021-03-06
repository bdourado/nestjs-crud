import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class ParamValidationPipe implements PipeTransform {

    transform (value: any, metadata: ArgumentMetadata) {
        if (!value) {
            throw new BadRequestException(`The value of the param '${metadata.data}' must be informed!`);
        }

        return value;
    }
}