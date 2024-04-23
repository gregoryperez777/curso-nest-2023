import axios from 'axios';
import { Move, PokeapiResponse } from '../interfaces/pokeapi-response.interface';

// Forma tradicional
// export class Pokemon {
//     public id: number;
//     public name: string;

//     constructor(id: number, name: string) {
//         this.id = id;
//         this.name = name;
//     }
// }

//forma Corta
export class Pokemon {

    get imageUrl(): string {
        return `https://pokemon.com/${this.id}.jpg`;
    }

    constructor(
         public readonly id: number, 
         public name: string
     ) {}

    scream():void  {
        console.log(`${this.name.toLocaleUpperCase()} !!!`);
    }

    speak():void  {
        console.log(`${this.name}, ${this.name}`);
    }

    async getMoves(): Promise<Move[]> {
        const { data } = await axios.get<PokeapiResponse>('https://pokeapi.co/api/v2/pokemon/4');
        return data.moves;
    }
}

// cuando usamos readonly en una propiedad de la clase
// indicamos que una vez instanciada la clase
// esa propiedad no puede variar 

export const charmander = new Pokemon(4, 'Charmander');

// console.log(charmander.imageUrl);
// charmander.scream();
// charmander.speak();

// console.log(charmander.getMoves() + 10);

charmander.getMoves();

