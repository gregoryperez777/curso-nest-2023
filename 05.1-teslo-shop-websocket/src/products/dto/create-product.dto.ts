import { ApiProperty } from "@nestjs/swagger";
import { 
    IsArray, IsIn, IsInt, 
    IsNumber, IsOptional, IsPositive, 
    IsString, MinLength 
} from "class-validator";


export class CreateProductDto {
    
    @ApiProperty({
        description: 'Product title (unique)',
        nullable: false,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    @IsOptional() // como vemos price es optional ya que tiene este simbolo(?) pero sino le colocamos el decorador optional nos va pedir el price
    price?: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty()
    @IsString({ each: true }) // esto indica que cada elemento del array debe ser string 
    @IsArray()
    sizes: string[];

    @ApiProperty()
    @IsIn(['men', 'woman', 'kid', 'unisex'])
    gender: string;

    @ApiProperty()
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[];

    @ApiProperty()
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];
}
