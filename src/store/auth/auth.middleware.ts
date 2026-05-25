import { ConsoleLogger, Injectable, NestMiddleware } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
import { ErrorCode } from "@share"
import { NextFunction, Request, Response } from "express"
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"
import { DataSource, Repository } from "typeorm"
import { AuthService } from "./auth.service"
import { APIException } from "@share/api"

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  protected logger = new ConsoleLogger(AuthMiddleware.name)


  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.originalUrl === "/api/auth/sign-in" || req.originalUrl === "/api/auth/refresh-token") {
      next()
      return
    }

    req.payload = null

    const bearerToken = AuthMiddleware.extractBearerToken(req)

    if (bearerToken) {
      const token = bearerToken
      try {
        req.payload = AuthService.verifySignature(token) as any
      } catch (e: any) {
        if (e instanceof TokenExpiredError) {
          throw new APIException(ErrorCode.ACCESS_TOKEN_EXPIRED)
        }
        if (e instanceof JsonWebTokenError) {
          throw new APIException(ErrorCode.UNAUTHORIZED, "Invalid signature or invalid token format")
        }
        // trigger token deletion on client side
        throw new APIException(ErrorCode.UNAUTHORIZED, e.message ? e.message : "Something wrong with the access token")
      }

      next()
      return
    }

    next()
  }


  protected static extractBearerToken(req: Request) {
    const header = req.header("Authorization")
    if (header && header.split(" ")[0] === "Bearer") {
      return header.split(" ")[1]
    }
    return undefined
  }

}
