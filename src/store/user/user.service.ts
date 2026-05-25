import { Inject, Injectable, Logger } from "@nestjs/common"
import { getRepositoryToken, InjectDataSource } from "@nestjs/typeorm"
import { Blockchain, Token } from "@share"
import { Role, User } from "@share/entities"
import bcrypt from "bcrypt"
import { DataSource, Repository } from "typeorm"

@Injectable()
export class UserService {
  protected logger = new Logger(UserService.name)

  constructor(
    @Inject(getRepositoryToken(User)) protected repository: Repository<User>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  async create({ password, ...params }: CreateUserParams) {
    const insertResult = await this.repository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        ...params,
        password: await UserService.hashPassword(password),
        balance: "0",
        banned: false,
      })
      .returning("*")
      .execute()
    return this.repository.create(insertResult.raw[0] as object)
  }

  async retrieve(id: string) {
    return await this.repository.findOneOrFail({
      where: {
        id,
      },
    })
  }

  static async hashPassword(password: string) {
    const saltOrRounds = 10
    return await bcrypt.hash(password, saltOrRounds)
  }

  static async comparePassword(password: string, passwordHash: string) {
    return await bcrypt.compare(password, passwordHash)
  }
}

export type CreateUserParams = {
  username: string
  password: string
  role: Role
}
