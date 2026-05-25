import { Controller, Get, Query } from "@nestjs/common"
import { IdDto } from "../../common/dto"
import { GetUser } from "./decorators"
import { User } from "@share/entities"
import { UserService } from "./user.service"

@Controller("user")
export class UserController {
  constructor(protected service: UserService) {}

  @Get("retrieve")
  async retrieve(@Query() { id }: IdDto, @GetUser() user: User) {
    return await this.service.retrieve(id)
  }
}
