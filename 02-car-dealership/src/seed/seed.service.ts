import { Injectable } from '@nestjs/common';
import { CarsService } from 'src/cars/cars.service';
import { BrandsService } from '../brands/brands.service';
import { BRANDS_SEED } from './data/brands.seed';
import { CARS_SEED,  } from './data/cars.seed';

@Injectable()
export class SeedService {

  constructor( 
    private readonly carsService: CarsService, 
    private readonly bransService: BrandsService
  ) {}

  populateDB () {
    this.carsService.fillCarsWithSeedData( CARS_SEED );
    this.bransService.fillBrandWithSeedData( BRANDS_SEED );
    return 'Seed executed';
  }
}
