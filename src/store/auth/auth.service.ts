import { Inject, Injectable } from "@nestjs/common"
import { getRepositoryToken } from "@nestjs/typeorm"
import { User } from "@share/entities"
import { instanceToPlain } from "class-transformer"
import jwt, { SignOptions } from "jsonwebtoken"
import { jwtDecode } from "jwt-decode"
import { Repository } from "typeorm"
import { JwtConfig } from "../../config"
import { UserService } from "../user/user.service"
import AuthExceptions from "./auth.exceptions"

@Injectable()
export class AuthService {
  constructor(@Inject(getRepositoryToken(User)) public repository: Repository<User>) {}

  async authenticate(username: string, password: string): Promise<User> {
    const user = await this.repository.findOneBy({ username })
    if (!user) {
      throw new AuthExceptions.NotFound()
    }
    const isCompared = await UserService.comparePassword(password, user.password)
    if (!isCompared) {
      throw new AuthExceptions.InvalidPassword()
    }

    await this.checkPolitics(user)

    return user
  }

  async checkPolitics(user: User): Promise<true> {
    if (user.banned) {
      throw new AuthExceptions.IsBanned()
    }
    return true
  }

  public static generateToken<T extends object>(payload: T, expMilliseconds?: number) {
    let options: SignOptions = {
      algorithm: "RS256",
    }
    if (expMilliseconds) {
      // "100" is equal 100ms, 100 is equal 100s.
      options.expiresIn = `${expMilliseconds}`
    }

    return jwt.sign(instanceToPlain(payload), JwtConfig.privateKey, options)
  }

  public static verifySignature<T extends object>(token: string): T {
    return jwt.verify(token, JwtConfig.publicKey, {
      ignoreExpiration: false,
      algorithms: ["RS256"],
    }) as T
  }

  static extractPayloadFromRawToken<T extends Object>(token: string) {
    return jwtDecode(token) as T
  }

  static createAuthorizationHeader(token: string) {
    return `Bearer ${token}`
  }
}
