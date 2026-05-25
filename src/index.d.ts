import { ProjectPayload, UserPayload } from "@share"
import { User } from "@share/entities"


declare global {
  namespace Express {
    interface Request {
      payload: UserPayload | null
    }
  }
}


