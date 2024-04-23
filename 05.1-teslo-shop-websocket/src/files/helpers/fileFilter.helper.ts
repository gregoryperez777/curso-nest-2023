
// debemos usar la variable Express que esta de manera global en nest
// para obtener un mejor tipado en este caso con respecto a la request

export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

    if (!file) return callback( new Error('File is Empty'), false );
    
    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    if (validExtensions.includes(fileExtension)) {
        callback(null, true);
    }

    callback(null, false);
}