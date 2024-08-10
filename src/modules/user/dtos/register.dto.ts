//TODO
// Add validation
export class RegisterRequestBodyDto {
  name: string;
  email: string;
  password: string;
}

export class RegisterResponseDto {
  userId: number;
  redirectTo: string;
}
