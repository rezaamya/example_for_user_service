import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class ErrorsUtilitiesService {
  public handleError(error: Error, logger: Logger) {
    if (error instanceof HttpException) {
      throw error;
    }

    logger.error(error);
    throw new InternalServerErrorException();
  }
}
