import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ProcessedWebhook, TopUp, User } from "@share/entities"
import { AuthMiddleware } from "./auth/auth.middleware"
import { AuthService } from "./auth/auth.service"
import { UserService } from "./user/user.service"
import { TopUpService } from "./top-up/top-up.service"
import { WebhookService } from "./webhook/webhook.service"
import { AuthController } from "./auth/auth.controller"
import { UserController } from "./user/user.controller"
import { WebhookController } from "./webhook/webhook.controller"
import { TopUpController } from "./top-up/top-up.controller"
import {DatabaseConfig} from "../config"
import { DataSource, DataSourceOptions } from "typeorm"
import { GateApi } from "./gate/gate.api"


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: "default",
      inject: [],
      useFactory: async () => {
        return {
          ...DatabaseConfig,
        }
      },
      dataSourceFactory: async (options) => {
        return new DataSource(options as DataSourceOptions)
      },
    }),
    TypeOrmModule.forFeature([User, TopUp, ProcessedWebhook]),
  ],
  providers: [AuthService, UserService, TopUpService, WebhookService, GateApi],
  controllers: [AuthController, UserController, TopUpController, WebhookController],
  exports: [],
})
export class StoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes({ path: "{*path}", method: RequestMethod.ALL })
  }
}
