import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from '../../products/entities';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string; // Es recomendable tener un ID unico que no cambie desde su creación

    @Column('text', {
        unique: true,
    })
    email: string;

    @Column('text', {
        nullable: false,
        select: false // ---> para que al hacer un find sobre la entiry user no traiga el password
    })
    password: string;


    @Column('text')
    fullName: string;

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];

    @OneToMany(
        // tabla a la que quiero apuntar
        () => Product,
        
        // con que parametro se relaciona 
        // en este caso con user

        // pero en este momento user no existe
        // en la otra tabla
        (product) => product.user
    )
    product: Product;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
}
