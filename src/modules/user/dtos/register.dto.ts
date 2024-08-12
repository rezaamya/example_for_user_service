import { UserEntity } from '../entities/user.entity';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  msgEmailIsMandatory,
  msgEmailRequirements,
  msgNameIsMandatory,
  msgNameRequirements,
  msgPasswordIsMandatory,
  msgPasswordRequirements,
} from '../msgs/validation.msg';
import {
  regExpValidEmail,
  regExpValidPassword,
} from '../constants/user.constant';

export class RegisterRequestBodyDto {
  @IsNotEmpty({ message: msgNameIsMandatory })
  @IsString({ message: msgNameRequirements })
  @MinLength(2, { message: msgNameRequirements })
  @MaxLength(20, { message: msgNameRequirements })
  name: UserEntity['name'];

  @IsNotEmpty({ message: msgEmailIsMandatory })
  @Matches(regExpValidEmail, {
    message: msgEmailRequirements,
  })
  email: UserEntity['email'];

  @IsNotEmpty({ message: msgPasswordIsMandatory })
  @Matches(regExpValidPassword, {
    message: msgPasswordRequirements,
  })
  password: UserEntity['password'];
}

export class RegisterResponseDto {
  userId: UserEntity['userId'];
  status: UserEntity['status'];
  redirectTo: string;
}
