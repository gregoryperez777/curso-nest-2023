import { v4 as uuid } from 'uuid';

// debemos usar la variable Express que esta de manera global en nest
// para obtener un mejor tipado en este caso con respecto a la request

export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

    if (!file) return callback( new Error('File is Empty'), false );
    
    const fileExtension = file.mimetype.split('/')[1];

    const fileName = `${uuid()}.${fileExtension}`;

    callback(null, fileName);
}