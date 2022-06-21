import { UseGuards, Controller, Post, Body, UsePipes, ValidationPipe, Param, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { AuthenticationService } from '@app/authentication/infraestructure/authentication.service';
import { LoginDto } from '@app/authentication/domain/dto/login.dto';
import { AuthGuard } from '@app/shared/infraestructure/guards/auth.guard';
import { MessageResponse } from '@app/shared/domain/model/message.response';

@Controller('')
export class AuthenticationController {

	/**
	 * Inyeccion de dependencias.
	 * @param authenticationService 
	 */
	constructor(private readonly authenticationService: AuthenticationService) { }
	
	@UsePipes(new ValidationPipe({ whitelist: true }))	
	@Post('/login')
	async login(@Body() loginDto: LoginDto): Promise<MessageResponse> {
		
		const response = await this.authenticationService.login(loginDto);
		if (response.statusCode != HttpStatus.OK) {
			return response;
		}

		return await this.authenticationService.buildUserResponse(response.response);
	}

	@UsePipes(new ValidationPipe({ whitelist: true }))  
	@UseGuards(AuthGuard)
	@Post('/logout/:id')
	async logout(@Param('id', ParseIntPipe) usuarioId: number): Promise<MessageResponse> {

		const usuario = await this.authenticationService.logout(usuarioId);
		return await this.authenticationService.buildUserResponseLogout(usuario);
	}
}
