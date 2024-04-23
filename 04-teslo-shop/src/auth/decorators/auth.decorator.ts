import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleProtected } from './role-protected.decorator';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';
import { ValidRoles } from '../interfaces';

export function Auth(...roles: ValidRoles[]) {
    
    /**
     *  applyDecorators es una funcion que recibe como argumentos
     *  decoradores y retorna un nuevo decorator que aplica todos 
     *  los decoradores enviados por parametros
     */
    return applyDecorators(
        
        /**
         * Aqui no colocamos el @ solo colocamos el decorador
         */
        RoleProtected(...roles),
        UseGuards(AuthGuard(), UserRoleGuard)
    );
}