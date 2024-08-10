import { Body, Controller, Post } from '@nestjs/common';

import {
  RegisterRequestBodyDto,
  RegisterResponseDto,
} from '../dtos/register.dto';
import { RegisterService } from '../services/register.service';

@Controller('v1/register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  async register(
    @Body() body: RegisterRequestBodyDto,
  ): Promise<RegisterResponseDto> {
    try {
      return await this.registerService.newUser(
        body.name,
        body.email,
        body.password,
      );
    } catch (e) {
      //TODO
      // Handle Error
      console.log(e);
    }
  }
}
