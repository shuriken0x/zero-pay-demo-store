import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common"
import { AuthGuard } from "../auth/guards/auth.guard"
import { UUIDDto } from "../../common/dto"
import { TopUpService } from "./top-up.service"
import { CreateTopUpDto } from "./dto/create-top-up.dto"
import { GetUser } from "../user/decorators"
import { User } from "@share/entities"
@UseGuards(AuthGuard)
@Controller("top-up")
export class TopUpController {
  constructor(protected service: TopUpService) {}

  @Post("create")
  async create(@Body() dto: CreateTopUpDto, @GetUser() user: User) {
    return await this.service.create({
      ...dto,
      userId: user.id,
    })
  }

  @Get("retrieve")
  async retrieve(@Query() { id }: UUIDDto) {
    return await this.service.retrieve(id)
  }
}
