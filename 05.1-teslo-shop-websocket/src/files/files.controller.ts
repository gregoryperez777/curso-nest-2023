import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers/';

@ApiTags('Files -- Get and Upload')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService  
  ) {}

  @Get('product/:imageName')
  findProductImage(

    // Al utilizar este decorador se le dice a nest que nosotros majaremos
    // manualmente la respuesta

    // Hay que tener cuidado al usar este decorador porque nos saltamos 
    // ciertos pasos del ciclo de vida
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getStaticProductImage(imageName);

    // res.status(200).json({ path })

    res.sendFile(path);
  }


  @Post('product')

  // Este UseInterceptor es a quien se le dice 
  // el nombre del parametro donde viene el archivo
  // en este caso es 'file' obviamente se puede llamar
  // de cualquier manera
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: { fileSize: 1000 }

    // ./ hace referencia a la carpeta root del proyecto
    // dentro de las carpeta products y upload se creo un archivo .gitkeep para que git le de seguimiento 
    // a las carpetas vacias porque de otra forma las ignora
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))

  //  Aqui al igual que el resto de las peticiones
  //  debemos usar un decorador para obtener la informacion deseada
  //  recuerda 
  //    @Body para el cuerpo de un json
  //    @Query para obtener los datos en la url despues de ? 
  //    @Params para obtener los parametros de la url

  // Express es una variable global pero para tener un mejor tipado con respecto a multer 
  // debemos instalar yarn add -D @types/multer
  // con esta dependencia instalada mejoramos el tipado a lo que multer se refiere
  uploadFileImage(@UploadedFile() file: Express.Multer.File) {
    
    console.log({ fileInController: file });
    
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    // const secureUrl = `${file.filename}`;
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return {
      secureUrl
    };
  }
}
