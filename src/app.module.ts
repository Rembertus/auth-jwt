// Descripción : Authentication with JSON Web Tokens (JWT), Nest.JS, Backend.
// Autor   		 : Remberto Gonzales Cruz (rembertus@gmail.com)
// Fecha de Creación: 20/06/2022

import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@app/app.controller';
import { AuthMiddleware } from '@app/authentication/infraestructure/middlewares/auth.middleware';
import { AuthenticationModule } from '@app/authentication/infraestructure/authentication.module';
import { UserModule } from '@app/user/infraestructure/user.module';

const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: !ENV ? '.env' : `.env.${ENV}` }),    
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}', __dirname + '/**/*.view{.ts,.js}'],
    }),
    AuthenticationModule,        
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
