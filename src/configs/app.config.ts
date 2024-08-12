import * as process from 'process';

export interface IAppConfig {
  port: number;
  redirectToAfterNewUserRegistration: string;
  redirectToAfterNewUserLogin: string;
}

const appConfig = () => ({
  app: {
    port: parseInt(process.env.APP_PORT, 10),
    redirectToAfterNewUserRegistration:
      process.env.APP_REDIRECT_TO_AFTER_NEW_USER_REGISTRATION,
    redirectToAfterNewUserLogin:
      process.env.APP_REDIRECT_TO_AFTER_NEW_USER_LOGIN,
  },
});

export default appConfig;
