import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data: string | string[], ctx: ExecutionContext) => {

        /**
         * data: son los argumentos que se le pasan al decorador cuando lo llamamos
         *  
         * 
         * ctx: Es el contexto en el que se esta ejecutando
         * la funcion o la aplicacion en este momento y nos da 
         * acceso a la request lo que necesitamos para tomar el usuario
         */

        const req = ctx.switchToHttp().getRequest();
        let user = req.user;

        if (!user)
            throw new InternalServerErrorException('User not found (request)');

        if (Array.isArray(data)) {
            
            user = {};
            data.map(property => {
                user[property] = req.user[property]
            });
        } 

        if (typeof data === 'string') {
            return req.user[data]
        }



        return user;
    }
);