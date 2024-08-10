import { Module } from "@nestjs/common";
import { UserModule } from "./modules/user/user.module";
import { ConfigModule } from "@nestjs/config";
import appConfig from "./configs/app.config";
import { configValidator } from "./configs/validator";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig],
      validate: configValidator
    }),
    UserModule],
  controllers: [],
  providers: []
})
export class AppModule {
}
