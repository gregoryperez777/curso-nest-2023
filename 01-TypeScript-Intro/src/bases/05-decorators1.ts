
/***
 *  Decorator: un decorador no es mas que una funcion que tiene acceso
 *  a la definicion de la clase y con esto va a poderla expandir o extender
 *  añadir, bloquear, remover o sobreescribir funcionalidad por lo general regresan 
 *  una funcion o una modificacion 
 */


class NewPokemon {
    constructor(
        public readonly id: number,
        public name: string 
    ) {}

    scream() {
        console.log(`No quiero`);
    }

    speak() {
        console.log(`No quiero hablar`);
    }
}


const MyDecorator = () => {
    return (target: Function) => {
        // console.log(target);
        return NewPokemon;
    }
}

@MyDecorator()
export class Pokemon {
    constructor(
        public readonly id: number,
        public name: string 
    ) {}

    scream() {
        console.log(`${ this.name.toUpperCase() } !!`);
    }

    speak() {
        console.log(`${ this.name } ${ this.name }!`);
    }
}

export const charmander = new Pokemon(4, 'Charmander');

charmander.scream();
charmander.speak();