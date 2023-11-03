import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(403).json({ message: exception.message });
  }
}