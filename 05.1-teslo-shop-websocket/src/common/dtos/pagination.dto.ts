import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto {

    /**
     *  NOTA:
     * 
     *  Estas conversiones o transformaciones serian opcional
     *  si en el archivo main.ts se agrega 
     * 
     *  transform: true, // Transforma la data que llega a los DTO
     *  transformOptions: {
     *      enableImplicitConversion: true // activa la conversion implicita de los tipo de datos que llegan a los DTO      
     *  }
     *  
     *  Entonces se asume que habilitarla seria el camino correcto
     * 
     */

    @ApiProperty({
        default: 10,
        description: 'how many rows do you need'
    })
    @IsOptional()
    @IsPositive()

    // Transformar de string a number
    @Type(() => Number) 
    limit?: number;


    @ApiProperty({
        default: 0,
        description: 'how many rows do you want to skip'
    })

    @IsOptional()
    @Min(0)

    // Transformar de string a number
    @Type(() => Number) 
    offset?: number;
}