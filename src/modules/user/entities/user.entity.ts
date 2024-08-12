import { UserRegisteredBy, UserStatus } from '../constants/user.constant';

export type UserEntity = {
  userId: number;
  name: string;
  email: string;
  sanitizedEmail: string;
  password: string;
  status: (typeof UserStatus)[keyof typeof UserStatus];
  registeredBy: (typeof UserRegisteredBy)[keyof typeof UserRegisteredBy];
  registeredAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
};
