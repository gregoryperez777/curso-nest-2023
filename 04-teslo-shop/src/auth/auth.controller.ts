import { Controller, Post, Body, Get, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';

import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 201, description: 'Product was created', type: User })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    // con esto podemos ver toda la data de la request
    // y llegamos al usuario porque se paso por AuthGuard
    // entonces para no acceder como request.user ya se ve mal
    // se realizara un decorator custom
    @Req() request: Express.Request,
    
    // formas de pasar el decorator
    @GetUser() user: User, //Sin argumentos
    @GetUser('email') userEmail: string, //Con un argumento
    @GetUser(['email', 'fullName', 'isActive']) propertyUser: User, //Con N argumento
    @RawHeaders() rawHeaders: string[]
  ) {

    console.log(request);
    // console.log({ user: request.user });

    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
      userEmail,
      propertyUser,
      rawHeaders
    }
  }

  // USANDO @SetMetadata
  // @Get('private2')
  // // SetMetadata sirve para añadir informacion extra
  // // al metodo o al controlador que se quiere ejecutar
  // @SetMetadata('roles', ['admin', 'super-user'])
  // @UseGuards(AuthGuard(), UserRoleGuard)
  // privateRoute2(
  //   @GetUser() user: User
  // ) {

  //   return {
  //     ok: true,
  //     user
  //   }
  // }

  /**
   *  Aqui se va a implementar un decorador customizado 
   *  para los roles del usuario 
   * 
   *  TIP: Antes de generar el decorador tenemos que preguntarnos 
   *  esta ligado estrechamente al modulo y por ende va en la carpeta
   *  decorator del mismo modulo o es general y va en la carpeta common 
   * 
   */
  @Get('private2')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User
  ) {

    return {
      ok: true,
      user
    }
  }

 /**
 * Aqui vamos a realizar composition decorator
 * 
 */
  @Get('private3')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  privateRoute3(
    @GetUser() user: User
  ) {

    return {
      ok: true,
      user
    }
  }

}
