import { HttpException, HttpStatus } from "@nestjs/common"
import { ErrorCode } from "@share"

type ApiExceptionMessage = string | object

export class APIExceptionResponse {
  statusCode: number
  errorCode: ErrorCode
  message?: ApiExceptionMessage
}

export class APIException extends HttpException {
  constructor(code: any, message?: ApiExceptionMessage, cause?: Error) {
    super(
      { statusCode: HttpStatus.BAD_REQUEST, errorCode: code, message } as APIExceptionResponse,
      HttpStatus.BAD_REQUEST,
      { cause },
    )
  }
}
