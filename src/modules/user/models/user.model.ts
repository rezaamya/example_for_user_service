import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { UserEntity } from '../entities/user.entity';
import { EmailUtilitiesService } from '../../utils/services/email-utilities.service';
import { UserStatus } from '../constants/user.constant';

@Injectable()
export class UserModel {
  constructor(
    @Inject('PG') private readonly pool: Pool,
    private readonly emailUtilitiesService: EmailUtilitiesService,
  ) {}

  public async findOneBySanitizedEmail(
    sanitizedEmail: UserEntity['sanitizedEmail'],
  ): Promise<Omit<UserEntity, 'password'> | undefined> {
    try {
      const result = await this.pool.query(
        `SELECT * FROM users WHERE sanitizedEmail = $1;`,
        [sanitizedEmail],
      );
      return result.rows[0]
        ? { ...result.rows[0], password: undefined }
        : undefined;
    } catch (e) {
      //TODO
      // Handle errors
    }
  }

  public async insertOne(data: {
    name: UserEntity['name'];
    email: UserEntity['email'];
    sanitizedEmail?: UserEntity['sanitizedEmail'];
    password: UserEntity['password'];
    status?: UserEntity['status'];
    registeredBy: UserEntity['registeredBy'];
  }): Promise<UserEntity['userId']> {
    try {
      const sanitizedEmail = data.sanitizedEmail
        ? data.sanitizedEmail
        : this.emailUtilitiesService.sanitize(data.email);

      const status = data.status || UserStatus.Active;

      const result = await this.pool.query(
        `insert into users (name, email, "sanitizedEmail", password, status, "registeredBy") values ($1, $2, $3, $4, $5, $6) returning *;`,
        [
          data.name,
          data.email,
          sanitizedEmail,
          data.password,
          status,
          data.registeredBy,
        ],
      );

      return result.rows[0].userId;
    } catch (e) {
      //TODO
      // Handle errors
      console.log(e);
    }
  }
}
