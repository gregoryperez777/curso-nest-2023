// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

/**
 * NOTA: aqui comentamos PartialType que viene de @nestjs/mapped-types y se incluye 
 * el mismo PartialType pero del @nestjs/swagger esto se hizo para que el swagger
 * pueda reconocer este DTO que extiende de PartialType(CreateProductDto)
 */


export class UpdateProductDto extends PartialType(CreateProductDto) {}
