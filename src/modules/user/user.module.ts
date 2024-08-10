import { Module } from '@nestjs/common';
import { RegisterController } from './controllers/register.controller';
import { RegisterService } from './services/register.service';
import { UserModel } from './models/user.model';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [UtilsModule],
  controllers: [RegisterController],
  providers: [RegisterService, UserModel],
  exports: [],
})
export class UserModule {}
