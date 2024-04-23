import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../products/entities/product.entity';
import { User } from '../auth/entities/user.entity';

import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  
  constructor (
    private readonly productsService: ProductsService,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async runSeed() {

    await this.deleteTables();
    const adminUser = await this.insertUsers();
    

    await this.insertNewProducts(adminUser);

    return 'SEED EXECUTED';
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();

    await queryBuilder
      .delete()
      .where({})
      .execute()
  }

  private async insertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    // Recorre un array de usuarios y los prepara para 
    // guardar en la DB
    seedUsers.forEach( user => {
      users.push(this.userRepository.create(user))
    })

    // Aqui se pasa seedUser porque save pide
    // un entitie
    const dbUsers = await this.userRepository.save(seedUsers);

    return dbUsers[0];

  }

  private async insertNewProducts(user: User) {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push(this.productsService.create(product, user));
    })

    await Promise.all(insertPromises);

    return true;

  }

}
