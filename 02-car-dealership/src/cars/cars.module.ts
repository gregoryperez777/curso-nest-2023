import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';

@Module({
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService]
})

/** 
 * Lo que exportamos en con exports es lo unico que a lo cual podemos 
 * acceder fuera de él
 */

export class CarsModule {}
