import { IsOptional, isString, IsString, IsUUID, MinLength, minLength } from "class-validator";

export class UpdateCarDto {
    
    @IsString()
    @IsUUID()
    @IsOptional()
    readonly id?:    string;

    @IsString()
    @IsOptional()
    readonly brand?: string;

    @IsString()
    @IsOptional()
    readonly model?: string;

}