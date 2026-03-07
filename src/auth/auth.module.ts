import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/user/entities/user.entity';
import { Session } from 'src/session/entities/session.entity';
import { PasswordResetToken } from 'src/password-reset/entities/password-reset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session, PasswordResetToken])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
