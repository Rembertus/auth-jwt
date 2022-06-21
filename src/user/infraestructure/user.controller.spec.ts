import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as supertest from 'supertest';

import { UserModule } from '@app/user/infraestructure/user.module';
import { ConfigModule } from '@nestjs/config';

jest.setTimeout(20000);

describe('Users', () => {
  let app: INestApplication;
  var token = null;
  var userId: number;
  var firstname = `firstname${Math.floor(Math.random() * 999999)}`;  
  var lastname = `lastname${Math.floor(Math.random() * 999999)}`;  
  var email = `user${Math.floor(Math.random() * 999999)}@gmail.com`;  
  var mypassword = `pas${Math.floor(Math.random() * 999999)}`;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          expandVariables: true,
        }),
        UserModule,
        TypeOrmModule.forRoot({
          type: process.env.DB_TYPE as any,
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,          
          entities: ['./**/*.entity.ts', './**/*.view.ts'],          
          synchronize: false,
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  describe('POST /users', () => {
    it('should return a new Data User', async () => {
      const { body } = await supertest
        .agent(process.env.SERVER_TEST)
        .post('/users')
        .send({ firstname: firstname, lastname: lastname, email: email, mypassword: mypassword })
        .set('Accept', 'application/json')
        .expect(201);

      userId = parseInt(body.response.id);
      expect(userId).toEqual(expect.any(Number));
    });
  });

  describe('POST /login', () => {
    it('should return a Token', async () => {
      const { body } = await supertest
        .agent(process.env.SERVER_TEST)
        .post('/login')
        .send({ email: email, mypassword: mypassword })
        .set('Accept', 'application/json')
        .expect(201);
  
      token = body.response.token;
      expect(parseInt(body.response.id)).toEqual(expect.any(Number));
    });
  });    

  describe(`GET /users/${userId}`, () => {
    it('should return an user', async () => {
      const { body } = await supertest
        .agent(process.env.SERVER_TEST)
        .get('/users/' + userId)
        .set({ Authorization: 'Token ' + token, 'Content-Type': 'application/json' })
        .set('Accept', 'application/json')
        .expect(200);

        expect(body.response.id).toEqual(userId);
    });
  }); 

  describe(`GET /users`, () => {
    it('hould return user list', async () => {
      const { body } = await supertest
        .agent(process.env.SERVER_TEST)
        .get('/users')        
        .set({ Authorization: 'Token ' + token, 'Content-Type': 'application/json' })
        .set('Accept', 'application/json')
        .expect(200);

        expect(body.response.result).toHaveLength(1);
    });
  });

  describe(`PUT /users/${userId}`, () => {
    it('should return an user updated', async () => {
      const personaId = 1;
      const { body } = await supertest
        .agent(process.env.SERVER_TEST)
        .put('/users/' + userId)
        .send({ firstname: firstname + '_modified', lastname: lastname + '_modified' })
        .set({ Authorization: 'Token ' + token, 'Content-Type': 'application/json' })
        .set('Accept', 'application/json')
        .expect(200);
        
        expect(body.response.id_persona).toEqual(personaId);
    });
  });

  describe(`DELETE /users/${userId}`, () => {
    it('should return an user removed', async () => {
      const { body } = await supertest
        .agent(process.env.SERVER_TEST)
        .delete('/users/' + userId)
        .set({ Authorization: 'Token ' + token, 'Content-Type': 'application/json' })
        .set('Accept', 'application/json')
        .expect(200);

        expect(body.response.id).toEqual(userId);
    });
  });

  afterAll(async () => {
    await app.close();
  });  
});
