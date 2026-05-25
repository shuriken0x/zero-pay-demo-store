import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { ProcessedWebhook, TopUp, User } from "@share/entities"
import { Env } from "@share/env"
import process from "process"
import { LoggerOptions } from "typeorm"
import { MixedList } from "typeorm/common/MixedList"
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions"
import { z } from "zod"
import { Initial1779744583796 } from "../db/migrations/1779744583796-initial"

const schema = z.object({
  host: z.string(),
  port: z.coerce.number().int(),
  username: z.string(),
  password: z.string(),
  database: z.string(),
})

export default function () {
  const logLevels: LoggerOptions = [
    "log",
    "warn",
    "error",
    // "migration",
    // "schema"
    // "query"
  ]

  const connectionConfig = schema.parse({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  })

  const baseConfig = {
    type: "postgres",
    ...connectionConfig,
  } as PostgresConnectionOptions

  const sharedOptions = {
    schema: "public",
    // logger: new TypeOrmWinstonLogger() as any,
    logging: logLevels,
    entities: [User, TopUp, ProcessedWebhook] as MixedList<Function>,
    migrations: [Initial1779744583796] as MixedList<Function>,
    migrationsTableName: "migrations",
    // installExtensions: true,
    extra: 16,
    autoLoadEntities: false,
    relationLoadStrategy: "join",
  } as PostgresConnectionOptions & Pick<TypeOrmModuleOptions, "autoLoadEntities">

  let dataSourceOptions: PostgresConnectionOptions

  if (Env.isDevelopment() || Env.isTest()) {
    dataSourceOptions = {
      ...baseConfig,
      ...sharedOptions,
      dropSchema: true,
      synchronize: true,
      migrationsRun: false,
    }
  } else if (Env.isProduction()) {
    dataSourceOptions = {
      ...baseConfig,
      ...sharedOptions,
      migrationsRun: true,
      synchronize: false,
      dropSchema: false,
    }
  } else {
    throw new Error(`Provided NODE_ENV(${process.env.NODE_ENV}) is invalid`)
  }
  return dataSourceOptions as PostgresConnectionOptions
}
