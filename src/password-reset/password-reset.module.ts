import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetToken } from './entities/password-reset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordResetToken])],
  exports: [TypeOrmModule],
})
export class PasswordResetModule {}
