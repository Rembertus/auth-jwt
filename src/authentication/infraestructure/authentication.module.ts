import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationController } from '@app/authentication/infraestructure/authentication.controller';
import { AuthenticationService } from '@app/authentication/infraestructure/authentication.service';
import { AuthGuard } from '@app/shared/infraestructure/guards/auth.guard';
import { UserEntity } from '@app/user/domain/model/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
    ]),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, AuthGuard],
  exports: [AuthenticationService],
})

export class AuthenticationModule {}
