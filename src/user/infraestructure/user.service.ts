import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { UserRepository } from '@app/user/domain/model/user.repository';
import { StatusEnum } from '@app/shared/infraestructure/enums/status.enum';
import { MessageEnum } from '@app/shared/infraestructure/enums/message.enum';
import { MessageResponse } from '@app/shared/domain/model/message.response';
import { UserCreateDto } from '@app/user/domain/dto/user-create.dto';

@Injectable()
export class UserService {

	/**
		* Inyeccion de Repositorios.
		* @param userRepository
	*/
	constructor(@InjectRepository(UserRepository)
	  private readonly userRepository: UserRepository,	
	) { }

	/**
	 * Crea los datos de una Entidad.
	 * @param cuentaCreateDto 
	 * @returns MessageResponse conteniendo los datos de la Entidad.
	 */
	 public async create(userDto: UserCreateDto): Promise<MessageResponse> {

		//#region Valida si el Usuario existe
		const user = await this.userRepository.findOne({
			where: { email: userDto.email.trim(), status: StatusEnum.Active },
		});

		if (user) {
			return new MessageResponse(HttpStatus.FOUND, MessageEnum.USER_EXIST, { id: user.id });
		}
		//#endregion

		let userId  = -1;
		const queryRunner = getConnection().createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		
		try {
			await this.userRepository.createUser(userDto, queryRunner)
				.then(async (resultCreate) => {					
					userId = resultCreate.response.id;										
				});

			await queryRunner.commitTransaction();
		} catch (error) {			
			await queryRunner.rollbackTransaction();
		} finally {
			await queryRunner.release()
		}

		return await this.get(userId);		
	}

	/**
 * Obtiene los datos de Entidades.
 * @returns MessageResponse conteniendo los datos o un codigo 404 - NO FOUND.
 */
	public async gets(): Promise<MessageResponse> {
		
		const users = await this.userRepository.find({
			where: { status: StatusEnum.Active },
		});

		if (users.length < 1) {
			return new MessageResponse(HttpStatus.NOT_FOUND, MessageEnum.ENTITY_SELECT_EMPTY, null);
		}

		return new MessageResponse(HttpStatus.OK, MessageEnum.ENTITY_SELECT, users);
	}

	/**
	 * Obtiene los datos de una Entidad.
	 * @param userId Identificador de la Entidad.
	 * @returns MessageResponse conteniendo los datos o un codigo 404 - NO FOUND.
	 */
	public async get(userId: number): Promise<MessageResponse> {

		const user = await this.userRepository.findOne({
			where: { id: userId, status: StatusEnum.Active },
		});

		if (!user) {
			return new MessageResponse(HttpStatus.NOT_FOUND, MessageEnum.USER_NOT_EXIST, { id: userId });
		}

		return new MessageResponse(HttpStatus.OK, MessageEnum.ENTITY_SELECT, user);
	}

	/**
 * Actualiza los datos.
 * @param userId  Identificador de la Entidad
 * @param usuarioUpdateDto Clase Dto para la validacion.
 * @returns MessageResponse conteniendo los datos o un codigo 404 - NO FOUND.
 */
	public async update(userId: number, userDto: UserCreateDto): Promise<MessageResponse> {

		//#region Valida si el Usuario existe
		const user = await this.userRepository.findOne({
			where: { id: userId, status: StatusEnum.Active },
		});

		if (!user) {
			return new MessageResponse(HttpStatus.NOT_FOUND, MessageEnum.USER_NOT_EXIST, { id: userId });
		}
		//#endregion

		const queryRunner = getConnection().createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			await this.userRepository.updateUser(userDto, user, queryRunner)
				.then(async (resultUpdate) => {
					userId = resultUpdate.response.id;
				});

			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
		} finally {
			await queryRunner.release()
		}

		return await this.get(userId);
	}

	/**
		 * Elimina logicamente los datos.
		 * @param userId Identificador de la Entidad
		 * @returns MessageResponse conteniendo los datos o un codigo 404 - NO FOUND.
		 */
	public async delete(userId: number): Promise<MessageResponse> {

		const user = await this.userRepository.findOne({
			where: { id: userId, status: StatusEnum.Active }
		});

		if (!user) {
			return new MessageResponse(HttpStatus.NOT_FOUND, MessageEnum.USER_NOT_EXIST, {id: userId});
		}

		return await this.userRepository.deleteUser(user);
	}
}
