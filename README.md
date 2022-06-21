# auth-jwt
Nest.JS, Authentication with JSON Web Tokens (JWT), Nest.JS, only Backend.

## Script for table in Postgres - Schema: "user",
```javascript 
CREATE TABLE "user"."user" (
	id bigserial NOT NULL,
	firstname varchar(50) NOT NULL DEFAULT ''::character varying,
	lastname varchar(100) NOT NULL DEFAULT ''::character varying,
	email varchar(100) NOT NULL,
	mypassword varchar(400) NOT NULL DEFAULT ''::character varying,
	secret2fa varchar(150) NULL,
	status int2 NOT NULL DEFAULT 0,
	CONSTRAINT pk_user PRIMARY KEY (id)
);
```
## Instructions
npm install  
npm install bcrypt  // for encryption password  
npm run start:dev  

## Tests
npm run test -t user.controller

### EndPoint Postman - Status Verify
GET http://127.0.0.1:3010/api/status  
<strong>Result</strong>
```javascript 
{
    "status": 200,
    "message": "Servicios ejecutandose!"
}
```  
### EndPoint Postman - Create User  
POST http://127.0.0.1:3010/api/users  
Body-Json
```javascript 
{
    "firstname": "juancito",
    "lastname": "pinto",
    "email": "juancito@gmail.com",
    "mypassword": "a1b2c3d4"
}
```
<strong>Result</strong>
```javascript 
{
    "statusCode": 200,
    "message": "Datos devueltos correctamente.",
    "response": {
        "id": "9",
        "firstname": "juancito",
        "lastname": "pinto",
        "email": "juancito@gmail.com",
        "status": 0
    }
}
```
### EndPoint Postman - Login  
POST http://127.0.0.1:3010/api/login  
Body-Json
```javascript 
{
    "email": "juancito@gmail.com",
    "mypassword": "a1b2c3d4"
}
```
<strong>Result</strong>
```javascript 
{
    "statusCode": 200,
    "message": "Datos devueltos correctamente.",
    "response": {
        "id": "9",
        "email": "juancito@gmail.com",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkiLCJpYXQiOjE2NTU4MjcyNjQsImV4cCI6MTY1NTg1NjA2NH0.QN_5RENZDk5hlaIKdEfOdR0b-D0Tx3D8-AoSUHSoIiI"
    }
}
```
### EndPoint Postman - Get Users List  
GET http://127.0.0.1:3010/api/users  
<strong>Headers  </strong>  
<strong>KEY:</strong> Authorization  
<strong>VALUE:</strong> Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkiLCJpYXQiOjE2NTU4MjcyNjQsImV4cCI6MTY1NTg1NjA2NH0.QN_5RENZDk5hlaIKdEfOdR0b-D0Tx3D8-AoSUHSoIiI  
<strong>Result</strong>
```javascript 
{
    "statusCode": 200,
    "message": "Datos devueltos correctamente.",
    "response": [
        {
            "id": "9",
            "firstname": "juancito",
            "lastname": "pinto",
            "email": "juancito@gmail.com",
				...
}
```

## For Support
- [Remberto Gonzales Cruz](rembertus@gmail.com)
