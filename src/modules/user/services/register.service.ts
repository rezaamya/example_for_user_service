import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UserModel } from '../models/user.model';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from '../../../configs/app.config';
import { EmailUtilitiesService } from '../../utils/services/email-utilities.service';
import { UserRegisteredBy } from '../constants/user.constant';

@Injectable()
export class RegisterService {
  constructor(
    private configService: ConfigService,
    private readonly userModel: UserModel,
    private readonly emailUtilitiesService: EmailUtilitiesService,
  ) {}
  public async newUser(
    name: UserEntity['name'],
    email: UserEntity['email'],
    password: UserEntity['password'],
  ): Promise<{ userId: UserEntity['userId']; redirectTo: string }> {
    try {
      const appConfig = this.configService.get<IAppConfig>('app');

      const sanitizedEmail = this.emailUtilitiesService.sanitize(email);

      const userExists =
        await this.userModel.findOneBySanitizedEmail(sanitizedEmail);

      if (userExists) {
        //TODO
        // Throw error include response message (Client error message)
      }

      const userId = await this.userModel.insertOne({
        name,
        email,
        sanitizedEmail,
        password,
        registeredBy: UserRegisteredBy.Email,
      });

      return {
        userId,
        redirectTo: appConfig.redirectToAfterNewUserRegistration,
      };
    } catch (e) {
      //TODO
      // Handle Error
      console.log(e);
    }
  }
}
