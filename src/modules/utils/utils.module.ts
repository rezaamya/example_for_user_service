import { Module } from '@nestjs/common';
import { EmailUtilitiesService } from './services/email-utilities.service';
import { EncryptionUtilitiesService } from './services/encryption-utilities.service';
import { ErrorsUtilitiesService } from './services/errors-utilities.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    EmailUtilitiesService,
    EncryptionUtilitiesService,
    ErrorsUtilitiesService,
  ],
  exports: [
    EmailUtilitiesService,
    EncryptionUtilitiesService,
    ErrorsUtilitiesService,
  ],
})
export class UtilsModule {}
