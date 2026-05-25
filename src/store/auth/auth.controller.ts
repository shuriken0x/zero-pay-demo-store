import { Body, Controller, Post, Req } from "@nestjs/common"
import ms from "ms"
import { AuthService } from "./auth.service"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "@share/entities"
import { Repository } from "typeorm"
import AuthExceptions from "./auth.exceptions"
import { APIException } from "@share/api"
import { ErrorCode } from "@share"
import { SignInDto } from "./dto/sign-in.dto"
import { pick } from "lodash"

@Controller("auth")
export class AuthController {
  protected accessTokenLifetime = ms("6h")

  constructor(
    protected service: AuthService,
    @InjectRepository(User) protected repository: Repository<User>,
  ) {}

  @Post("sign-in")
  async signIn(@Req() req: Request, @Body() { username, password }: SignInDto) {
    try {
      const user = await this.service.authenticate(username, password)

      return {
        user,
        accessToken: AuthService.generateToken(pick(user, ["id", "role"]), this.accessTokenLifetime),
      }
    } catch (e) {
      if (e instanceof AuthExceptions.IsBanned) {
        throw new APIException(ErrorCode.BUSINESS_ERROR, "You are banned")
      }
      if (e instanceof AuthExceptions.NotFound) {
        throw new APIException(ErrorCode.BUSINESS_ERROR, "User not found")
      }
      if (e instanceof AuthExceptions.InvalidPassword) {
        throw new APIException(ErrorCode.BUSINESS_ERROR, "Password is invalid")
      }
      throw e
    }
  }
}
