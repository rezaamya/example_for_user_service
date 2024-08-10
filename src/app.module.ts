import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { join } from 'path';
import { Pool } from 'pg';
import { UserModule } from './modules/user/user.module';
import appConfig from './configs/app.config';
import { configValidator } from './configs/validator';
import postgresConfig, { IPostgresConfig } from './configs/postgres.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, postgresConfig],
      validate: configValidator,
    }),
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'PG',
      useFactory: async (configService: ConfigService) => {
        try {
          const postgresConfig = configService.get<IPostgresConfig>('postgres');
          const pool = new Pool({
            host: postgresConfig.host,
            user: postgresConfig.user,
            password: postgresConfig.password,
            database: postgresConfig.database_name,
            port: postgresConfig.port,
          });

          const poolClient = await pool.connect();

          const sql = fs
            .readFileSync(join(__dirname, 'migration.sql'))
            .toString();
          await poolClient.query(sql);
          poolClient.release();

          return pool;
        } catch (e) {
          throw e;
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: ['PG'],
})
export class AppModule {}
