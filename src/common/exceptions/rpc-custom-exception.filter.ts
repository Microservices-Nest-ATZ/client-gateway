
import { Catch, ArgumentsHost, HttpStatus, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

interface RpcErrorObject {
  statusCode?: number;
  message?: string;
  [key: string]: any;
}

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {

  catch(exception: RpcException, host: ArgumentsHost) {

    const contex = host.switchToHttp();
    const response = contex.getResponse();

    const error = exception.getError();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (typeof error === 'string') {
      status = HttpStatus.BAD_REQUEST;
      message = error;
    }
    else if (this.isRpcErrorObject(error)) {
      if (typeof error.statusCode === 'number') {
        status = error.statusCode;
      }
      if (typeof error.message === 'string') {
        message = error.message;
      }
    }

    return response.status(status).json({
      statusCode: status,
      message,
      error: typeof error === 'object' ? error : undefined,
    });
  }

  private isRpcErrorObject(val: unknown): val is RpcErrorObject {
    return typeof val === 'object' && val !== null;
  }
}
