import { Role } from "./entities/role.enum"


export type UserPayload = {
  id: string
  role: Role
}