import { Inject, Injectable, Logger } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { UserEntity } from '../entities/user.entity';
import { EmailUtilitiesService } from '../../utils/services/email-utilities.service';
import { UserStatus } from '../constants/user.constant';
import { ErrorsUtilitiesService } from '../../utils/services/errors-utilities.service';

@Injectable()
export class UserModel {
  private readonly logger = new Logger(UserModel.name);

  constructor(
    @Inject('PG') private readonly pool: Pool,
    private readonly emailUtilitiesService: EmailUtilitiesService,
    private readonly errorsUtilitiesService: ErrorsUtilitiesService,
  ) {}

  public async findOneBySanitizedEmail(
    sanitizedEmail: UserEntity['sanitizedEmail'],
  ): Promise<UserEntity | undefined> {
    try {
      const result = await this.pool.query(
        `SELECT * FROM users WHERE "sanitizedEmail" = $1;`,
        [sanitizedEmail],
      );
      return result.rows[0] || undefined;
    } catch (e) {
      this.errorsUtilitiesService.handleError(e, this.logger);
    }
  }

  public async insertOne(
    data: {
      name: UserEntity['name'];
      email: UserEntity['email'];
      sanitizedEmail?: UserEntity['sanitizedEmail'];
      password: UserEntity['password'];
      status?: UserEntity['status'];
      registeredBy: UserEntity['registeredBy'];
      emailVerified?: UserEntity['emailVerified'];
    },
    poolClient?: PoolClient,
  ): Promise<Omit<UserEntity, 'password'>> {
    try {
      const dbPoolClient = poolClient ?? this.pool;

      const sanitizedEmail = data.sanitizedEmail
        ? data.sanitizedEmail
        : this.emailUtilitiesService.sanitize(data.email);
      const status = data.status || UserStatus.Active;
      const emailVerified = data.emailVerified === true;

      const result = await dbPoolClient.query(
        `insert into users (name, email, "sanitizedEmail", password, status, "registeredBy", "emailVerified") values ($1, $2, $3, $4, $5, $6, $7) returning *;`,
        [
          data.name,
          data.email,
          sanitizedEmail,
          data.password,
          status,
          data.registeredBy,
          emailVerified,
        ],
      );

      return { ...result.rows[0], password: undefined };
    } catch (e) {
      this.errorsUtilitiesService.handleError(e, this.logger);
    }
  }
}
