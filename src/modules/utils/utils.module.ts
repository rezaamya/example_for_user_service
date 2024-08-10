import { Module } from '@nestjs/common';
import { EmailUtilitiesService } from './services/email-utilities.service';

@Module({
  imports: [],
  controllers: [],
  providers: [EmailUtilitiesService],
  exports: [EmailUtilitiesService],
})
export class UtilsModule {}
