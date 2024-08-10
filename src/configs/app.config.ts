import * as process from 'process';

export interface IAppConfig {
  port: number;
  redirectToAfterNewUserRegistration: string;
}

const appConfig = () => ({
  app: {
    port: parseInt(process.env.APP_PORT, 10),
    redirectToAfterNewUserRegistration:
      process.env.APP_REDIRECT_TO_AFTER_NEW_USER_REGISTRATION,
  },
});

export default appConfig;
