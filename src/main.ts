import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { getBodyParserOptions } from "@nestjs/platform-express/adapters/utils/get-body-parser-options.util"
import { json, urlencoded } from "express"
import { ValidationPipe } from "./common/validation.pipe"
import { UserService } from "./store/user/user.service"
import { Role } from "@share/entities"
import { Logger } from "@nestjs/common"
import { AuthService } from "./store/auth/auth.service"
import { pick } from "lodash"

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    rawBody: true,
  })

  app.getHttpAdapter().getInstance().disable("x-powered-by")
  app.setGlobalPrefix("api")

  app.use(json(getBodyParserOptions(true, { limit: "50mb" })))
  app.use(urlencoded(getBodyParserOptions(true, { limit: "50mb", extended: true })))

  app.useGlobalPipes(new ValidationPipe())


  const user = await app.get(UserService).create({
    username: "admin",
    password: "admin",
    role: Role.Admin,
  })
  Logger.log(user) // user
  Logger.log(AuthService.generateToken(pick(user, ["id", "role"]))) // access token

  await app.listen(8080, "0.0.0.0")
}
void bootstrap()

process.setMaxListeners(25)

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
