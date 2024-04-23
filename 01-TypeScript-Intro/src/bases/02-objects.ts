export const pokemonIds = [1,20,30,34,66];

// pokemonIds.push('asjkldjsalksd');

// CTRL + . --> abre una ayuda cuando hay errores

// export const pokemon = {
//     id: 1,
//     name: 'buldbasur'
// }

// Para asegurarnos que un objeto tenga una estructura determinada creamos una 
// interfaz

interface Pokemon {
    id: number,
    name: string,
    age?: number
}

// una interfaz difiere de una clase porque no me permite instancearla 
// const charmander = new Pokemon()

export const bulbasaur:Pokemon = {
    id: 1,
    name: 'Bulbasour',
}

export const charmander:Pokemon = {
    id: 0,
    name: ""
} 

export const pokemons: Pokemon[] = [];

pokemons.push(charmander, bulbasaur);

console.log(pokemons);