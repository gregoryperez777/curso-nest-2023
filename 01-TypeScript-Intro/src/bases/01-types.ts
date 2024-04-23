

// cuando declaramos una constante indicar el tipo es opcional
// porque en teoria nunca va a cambiar

export let name: string = 'Gregory';
export const age: number = 31; 
export const isValid: boolean = true;

// Type safety --> indica que typescript se asgurara que el tipo de dato es el correspondiente 
// a la variable y si se puede asignarlo o no

// En este caso name no tiene un tipo declarado pero se le asigno un string
// por ende name sera una variable de tipo string

name = 'Carmen';
// name = 123;
// name = true;

export const templateString = `
    Esto es un string multilinea
    que puede tener 
    " dobles
    '
    inyectar valores ${name}
    expresiones ${ 1 + 1 }
    numeros: ${age}
    booleanos: ${isValid}
`; 

console.log(templateString);