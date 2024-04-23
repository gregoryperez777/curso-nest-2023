import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage, Product } from './entities';
import { validate as isUUID } from 'uuid';
import { User } from '../auth/entities/user.entity';


@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');
  
  constructor(
    // Aqui inyectamos nuestra entidad
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    
    private readonly dataSource: DataSource

  ) {}


  async create(createProductDto: CreateProductDto, user: User) {
    try {

      const { images = [], ...productDetails } = createProductDto;

      /**
       * En la linea donde hacemos images: images.map ...
       * 
       * Estamos creando las imagenes, segun el entity de product-image
       * necesitariamos pasarle product (para que haga referencia a este product)
       * pero como esto se esta creando dentro del create de product typeorm 
       * inferira el id del product cuando se haga this.productRepository.save
       * 
       * this.productRepository.save salvara tanto a product como product-image
       */
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image })),
        user,
      });
      await this.productRepository.save(product);

      return { ...product, images };

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // TODO: Paginar
  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset, 

      // NOTA: si hacemos control + barra espaciadora 
      // podemos ver las propiedades que acepta en este caso
      // el metodo find

      // Esto se comenta porque se activo el eager en la relacion de la entidad producto
      // relations: {
      //   images: true
      // }
    });

    return products.map(({ images, ...rest }) => ({
      ...rest,
      images: images.map(img => img.url)
    }));

  }

  async findOne(term: string) {

    let product: Product;

    if ( isUUID(term) ) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      // product = await this.productRepository.findOneBy({ slug: term });

      /**
       *  QueryBuilder metodo que nos permite crear querys con la seguridad 
       *  que nos escapa caracteres especiales para evitar problemas de
       *  seguridad
       * 
       *  Cuando instanciamos un queryBuilder automaticamente la variable
       *  sabe la cadena de conexion, la tabla a la que quiero apuntar e incluso 
       *  relaciones 
       * 
       *  OJO -> No me queda claro si el query builder solo puede encontrar un solo registro 
       * 
       *  `select * from Product where slug='xxx' or title=xxx`
       */

      // El string 'prod' es un alias para la tabla de producto
      // para luego usarlo en el leftJoin
      const queryBuilder = this.productRepository.createQueryBuilder('prod');


      /**
       * Aqui lo que se hizo fue pasar el titulo de la DB
       * a mayuscula y los terminos a mayuscula (title) y minuscula (slug)
       * 
       * para que coincidan al momento de la busqueda
       */

      console.log('term', term);

      product = await queryBuilder
        .where('UPPER(title)=:title or slug=:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages') // 'prod.images es con quien se va a relacionar y prodImages es otro alias que pide leftJoinAndSelect'
        .getOne();
    }

    console.log('product', product);

    if ( !product ) throw new NotFoundException(`Product with term ${term} not found`);
  
    return product;
  
  }

  async findOnePlain (term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    
    return {
      ...rest,
      images: images.map(img => img.url)
    }
  }
 
  async update(id: string, updateProductDto: UpdateProductDto, user: User) {

    const { images, ...toUpdate } = updateProductDto;




    /**
     *  Esto busca en la base de datos por el id
     *  y luego carga todas las propiedades del
     *  updateProductDto
     * 
     */
    const product = await this.productRepository.preload({ 
      id,
      ...toUpdate
    });

    if (!product) throw new NotFoundException(`Product with id: ${ id } not found`);

    // Create query runnner 
    // Es un metodo que nos permite ejecutar varias transacciones a la DB
    // y verificar que todas salgan bien para luego impactar la DB
    // pero si una llegase a fallar el query runner nos permite hacer roll back
    
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if ( images ) {

        // Esto elimina las imagenes anteriores
        await queryRunner.manager.delete( ProductImage, { product: { id } });
      
        product.images = images.map(image => this.productImageRepository.create({ url: image }))
      
      }
      
      // save en este caso es intenta grabarlo (puede fallar)

      product.user = user;
      await queryRunner.manager.save(product);

      // Aplica los cambios
      await queryRunner.commitTransaction();

      // una vez invocado el metodo release ya no va a funcionar
      // se tendria que conectar nuevamente
      await queryRunner.release();

      // await this.productRepository.save(product);
      return this.findOnePlain( id );
    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();


      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  private handleDBExceptions ( error: any ) {
    console.log(error);

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(`Unexpected error, check logs`);
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query
        .delete()
        .where({})
        .execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
}
