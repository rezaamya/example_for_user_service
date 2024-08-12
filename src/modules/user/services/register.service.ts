import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UserModel } from '../models/user.model';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from '../../../configs/app.config';
import { EmailUtilitiesService } from '../../utils/services/email-utilities.service';
import { UserRegisteredBy, UserStatus } from '../constants/user.constant';
import { EncryptionUtilitiesService } from '../../utils/services/encryption-utilities.service';
import { errorEmailIsAlreadyInUse } from '../msgs/validation.msg';
import { ErrorsUtilitiesService } from '../../utils/services/errors-utilities.service';
import { Pool, PoolClient } from 'pg';

@Injectable()
export class RegisterService {
  private readonly logger = new Logger(RegisterService.name);

  constructor(
    private configService: ConfigService,
    private readonly userModel: UserModel,
    private readonly emailUtilitiesService: EmailUtilitiesService,
    private readonly encryptionUtilitiesService: EncryptionUtilitiesService,
    private readonly errorsUtilitiesService: ErrorsUtilitiesService,
    @Inject('PG') private readonly pool: Pool,
  ) {}
  public async newUser(
    name: UserEntity['name'],
    email: UserEntity['email'],
    password: UserEntity['password'],
  ): Promise<{
    userId: UserEntity['userId'];
    status: UserEntity['status'];
    redirectTo: string;
  }> {
    let dbPoolClient: PoolClient;
    try {
      const appConfig = this.configService.get<IAppConfig>('app');

      const sanitizedEmail = this.emailUtilitiesService.sanitize(email);

      const userExists =
        await this.userModel.findOneBySanitizedEmail(sanitizedEmail);

      if (userExists) {
        // TODO
        //  should we response if user was exist and his email and password was match?
        //  if yes, uncomment following section
        // let isMatch = false;
        // if (userExists.password) {
        //   isMatch = await this.encryptionUtilitiesService.compare(
        //     password,
        //     userExists.password,
        //   );
        // }
        //
        // if (isMatch) {
        //   return {
        //     userId: userExists.userId,
        //     status: userExists.status,
        //     redirectTo: appConfig.redirectToAfterNewUserLogin,
        //   };
        // }

        throw new HttpException(errorEmailIsAlreadyInUse, HttpStatus.CONFLICT);
      }

      dbPoolClient = await this.pool.connect();
      await dbPoolClient.query('BEGIN');

      //TODO
      // 1) Create a random string
      // 2) Create an OTP module
      // 3) Insert generated random string into database using OTP module
      // 4) Send generated random string via Email to requested email
      // 5) Verify generated code (if it is not expired) using POST v1/otp/verify -> Response 200-Okay
      // 6) login using verified email and password

      const insertedUser = await this.userModel.insertOne(
        {
          name,
          email,
          sanitizedEmail,
          password,
          registeredBy: UserRegisteredBy.Email,
          status: UserStatus.RequiredEmailVerification,
        },
        dbPoolClient,
      );

      await dbPoolClient.query('COMMIT');
      return {
        userId: insertedUser.userId,
        status: insertedUser.status,
        redirectTo: appConfig.redirectToAfterNewUserRegistration,
      };
    } catch (e) {
      if (dbPoolClient) {
        await dbPoolClient.query('ROLLBACK');
      }
      this.errorsUtilitiesService.handleError(e, this.logger);
    } finally {
      if (dbPoolClient) {
        dbPoolClient.release();
      }
    }
  }
}
