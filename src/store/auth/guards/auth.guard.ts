import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Request } from "express"

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>()

    return Boolean(req.payload)
  }
}
