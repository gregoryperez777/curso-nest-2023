/**
 * Los archivos entity son una representacion de este 
 * objeto en la base de datos es decir una tabla si trabajamos 
 * con una DB relacional o una collection en caso de una DB no-relacional 
 */

/**
 * Constraints: reglas sobre una columna de la tabla
 * */ 

import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../auth/entities/user.entity';
import { ProductImage } from './product-image.entity';

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: '350e33e0-4abb-418c-bd0d-2f144bff5487',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     *  Nota cuando hacemos @Column() el primer parametro es el tipo
     *  de dato para ese atributo de la columna. Nest te mostrara muchos
     *  tipos (tratara de autocompletar) pero el que elijas debe ser 
     *  aceptado por la DB que estes usando ya que te mostrara tipos de 
     *  datos de mongo por ejemplo y aqui estamos usando postgres 
     * 
     *  El segundo parametro es un Constraints
     */

    @ApiProperty({
        example: 'T-shirt Teslo',
        description: 'Product Title',
        uniqueItems: true
    })
    @Column('text', { 
        unique: true
    })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Product price'
    })
    @Column('float', { default: 0 })
    price: number;

    // esta es otra forma de declarar el tipo y las reglas para esta propiedad
    @ApiProperty({
        example: 'this is a description',
        description: 'Product description',
        default: null
    })
    @Column({
        type: 'text',
        nullable: true // puede aceptar nulos
    })
    description: string;

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product SLUG - for SEO',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Product stock',
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['M', 'XL', 'XXL'],
        description: 'Product sizes',
        default: 0
    })
    @Column('text', {
        array: true
    })
    sizes: string[]

    @ApiProperty({
        example: 'woman',
        description: 'Product gender'
    })
    @Column('text')
    gender: string;

    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];


    // ESTO NO ES UNA COLUMNA ES UNA RELACION
    // cascade: true para cuando se elimine producto se elimine lo que esta relacionado a el
    // eager: true es una configuracion para que cuando se use cualquier find cargue automaticamente la relacion 
    // 1er argumento va a regresar un product image
    // 2do argumento como se relaciona productImage con nuetra tabla product
    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true } 
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user: User;


    @BeforeInsert()
    checkSlugInsert() {

        if (!this.slug) {
            this.slug = this.title;
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }
}
