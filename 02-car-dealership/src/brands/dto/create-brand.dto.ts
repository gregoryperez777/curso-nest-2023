import { IsString, MinLength, minLength } from 'class-validator';

export class CreateBrandDto {
    @IsString()
    @MinLength(1)
    name: string;
}
