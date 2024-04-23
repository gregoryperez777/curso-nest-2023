import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Controller('cars')
export class CarsController {

	constructor(private readonly carsService: CarsService) {}

	@Get()
	getAllCars() {
		return this.carsService.findAll();
	}
	
	// SIN USAR PIPE
	// @Get('/:id')
	// getCarById( @Param('id') id: string) {

	// 	// Se aconseja una +id para transformar en numeros
	// 	// porque si llegase un string al colocarle + 
	// 	// lo transforma a NaN

	// 	const index = parseFloat(id);
	// 	return this.carsService.findOneById(index);
	// }

	// USANDO PIPE
	@Get('/:id')

	// Podemos especificar mas detalles realizando una nueva instancia del PIPE	
	// getCarById( @Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {

	// Los PIPE se pueden usar asi sin declarar una nueva instacia
	// que es reutilizada por nest en toda la app
	getCarById( @Param('id', ParseUUIDPipe) id: string) {
		console.log({ id });

		return this.carsService.findOneById(id);
	}

	@Post()
	// Haciendo uso de PIPE a nivel de endpoint
	// los PIPE pueden usarse a nivel de endpoints, controladores
	// y aplicacion
	// @UsePipes(ValidationPipe) 
	createCar(@Body() createCarDto: CreateCarDto) {
		return this.carsService.create(createCarDto);
	}

	@Patch(':id')
	updateCar(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateCarDto: UpdateCarDto) {
		return this.carsService.update(id, updateCarDto);
	}

	@Delete(':id')
	deleteCar(@Param('id', ParseUUIDPipe) id: string) {
		return this.carsService.delete(id);
	}


}
