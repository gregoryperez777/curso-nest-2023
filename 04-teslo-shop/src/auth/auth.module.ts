import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

import { User } from './entities/user.entity'

import { JwtStrategy } from './strategies/jwt-strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [

    ConfigModule,

    TypeOrmModule.forFeature([ User ]),

    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: (configService: ConfigService) => {

        // Forma de acceder a las .env
        // console.log('JWT Secret', configService.get('JWT_SECRET'))
        // console.log('JWT Secret', process.env.JWT_SECRET)

        return {
          // secret: process.env.JWT_SECRET,
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    })

    // JwtModule.register({ 
    //   secret: process.env.JWT,
    //   signOptions: {
    //     expiresIn: '2h'
    //   }
    // })

  ],
  /**
   * Esto exporta la configuracion del 
   * 
   * TypeOrmModule.forFeature para luego poder interactuar con 
   * esa entidad desde otro recurso
   */
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule {}
