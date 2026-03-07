import { Global, Module } from '@nestjs/common';
import { JwtService } from './services/jwt.service';

@Global()
@Module({
  providers: [JwtService],
  exports: [JwtService],
})
export class CoreModule {}
