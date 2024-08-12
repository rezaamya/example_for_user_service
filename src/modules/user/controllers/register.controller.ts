import { Body, Controller, Logger, Post } from '@nestjs/common';

import {
  RegisterRequestBodyDto,
  RegisterResponseDto,
} from '../dtos/register.dto';
import { RegisterService } from '../services/register.service';
import { ErrorsUtilitiesService } from '../../utils/services/errors-utilities.service';

@Controller('v1/register')
export class RegisterController {
  private readonly logger = new Logger(RegisterController.name);

  constructor(
    private readonly registerService: RegisterService,
    private readonly errorsUtilitiesService: ErrorsUtilitiesService,
  ) {}

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
      this.errorsUtilitiesService.handleError(e, this.logger);
    }
  }
}
