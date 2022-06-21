import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginDto } from '@app/authentication/domain/dto/login.dto';
import { StatusEnum } from '@app/shared/infraestructure/enums/status.enum';
import { MessageEnum } from '@app/shared/infraestructure/enums/message.enum';
import { MessageResponse } from '@app/shared/domain/model/message.response';
import { UserEntity } from '@app/user/domain/model/user.entity';

@Injectable()
export class AuthenticationService {

  /**
   * Inyeccion de Repositorios.
   * @param usuarioRepository   
   */
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,    
  ) { }

  /**
   * Acceso a la Aplicacion
   * @param loginDto Credenciales del usuario
   * @returns 
   */
  public async login(loginDto: LoginDto): Promise<MessageResponse> {

    const usuario = await this.userRepository.findOne({
      select: ['id', 'email', 'mypassword'],
      where: { email: loginDto.email, status: StatusEnum.Active }
    });

    if (!usuario) {
      return new MessageResponse(HttpStatus.NOT_FOUND, MessageEnum.CREDENTIALS_INVALID, null);
    }

    const isCorrect = await compare(loginDto.mypassword, usuario.mypassword);
    if (!isCorrect) {
      return new MessageResponse(HttpStatus.UNPROCESSABLE_ENTITY, MessageEnum.CREDENTIALS_INVALID, null);
    }

    delete usuario.mypassword;
    return new MessageResponse(HttpStatus.OK, MessageEnum.ENTITY_SELECT, usuario);
  }

  /**
   * Obtiene los datos de un Usuario para acceso.
   * @param usuarioId Identificador de usuario.
   * @returns Datos del Usuario.
   */
  public async getUserLogin(usuarioId: number): Promise<UserEntity> {
    const usuario = await this.userRepository.findOne(
      { id: usuarioId, status: StatusEnum.Active }
    );

    if (!usuario) {
      throw new NotFoundException(MessageEnum.ACCESS_INVALID);
    }

    delete usuario.mypassword;
    return usuario;
  }

  /**
   * Salir de la aplicacion.
   * @param usuarioId Identificador de Usuario.
   * @returns Token nulo.
   */
  public async logout(usuarioId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne(
      { id: usuarioId, status: StatusEnum.Active }
    );
    if (!user) {
      throw new NotFoundException(MessageEnum.USER_NOT_EXIST);
    }

    delete user.mypassword;
    return user;
  }

  /**
   * Genera un token JWT para un usuario.
   * @param usuario Datos del Usuario.
   * @returns Token.
   */
  private generateJwt(usuario: UserEntity): string {
    return sign(
      {
        id: usuario.id,
      },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME + 's' },
    );
  }

  /**
    * Contruye una Respuesta a partir de los datos del Usuario.
    * @param user Datos del Usuario.
    * @returns MessageResponse.
    */
   async buildUserResponse(user: UserEntity): Promise<MessageResponse> {

    const messageResponse = new MessageResponse();
    messageResponse.statusCode = HttpStatus.OK;
    messageResponse.message = MessageEnum.ENTITY_SELECT;
    messageResponse.response = {
      ...user,
      token: this.generateJwt(user),
    };

    return messageResponse;
  }


  /**
   * Contruye una Respuesta a partir de los datos del Usuario para Logout
   * @param usuario Datos del Usuario.
   * @returns 
   */
  buildUserResponseLogout(user: UserEntity): any {
    return {
      ...user,
      token: null,      
    };
  }
}

