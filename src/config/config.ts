import { z } from "zod"
import { ConfigService } from "./config.service"
import jwtConfig from "./jwt.config"
import path from "path"
import appRootPath from "app-root-path"
import fs from "fs"
import yaml from "js-yaml"
import databaseConfig from './database.config';

z.enum(["development", "production", "test"]).parse(process.env.NODE_ENV)

ConfigService.loadEnv()

export const DatabaseConfig = databaseConfig()
export const JwtConfig = jwtConfig()


