export enum UserStatus {
  Active = 'active',
  Blocked = 'blocked',
  RequiredEmailVerification = 'requiredEmailVerification',
}

export enum UserRegisteredBy {
  Email = 'email',
  Google = 'google',
}

export const regExpValidEmail =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const regExpValidPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
