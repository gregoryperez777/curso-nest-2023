import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    
    @ApiProperty({
        description: 'Email by user',
        example: 'pedroperez@example.com'
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password of the account',
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;
}