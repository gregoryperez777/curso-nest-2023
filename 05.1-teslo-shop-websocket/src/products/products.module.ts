import { Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';

import { Product, ProductImage } from './entities';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],

  /**
   *  En el archivo app.module.ts se definieron estos parametros en 
   *  true
   * 
   *  autoLoadEntities
   *  synchronize
   *  
   *  Pero para que ellos hagan efecto desde cada modulo se debe realizar esto
   * 
   *  Este imports de TypeOrmModule es para que Nest sincronize las 
   *  entidades pasadas en el array del forFeature con la DB.
   *  
   *  se podria decir que este modulo le avisa al modulo principal cual
   *  tiene que sincronizar
   */
  imports: [
    TypeOrmModule.forFeature([ Product, ProductImage ]),
    AuthModule
  ],
  exports: [ProductsService, TypeOrmModule]
})
export class ProductsModule {}
