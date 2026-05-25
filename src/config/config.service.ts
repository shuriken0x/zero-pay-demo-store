import appRoot from "app-root-path"
import dotenv from "dotenv"
import path from "path"
import process from "process"

// dotenv.config();

export class ConfigService {
  static readonly mediaRoot = path.join(ConfigService.getRootDir(), "media")
  static readonly mediaPrivateRoot = path.join(ConfigService.mediaRoot, "private")

  static readonly mediaURL = "/media/"

  protected static NODE_ENV = process.env.NODE_ENV

  static loadEnv() {
    if (!process.env.NODE_ENV) return;

    const envPathMap = {
      development: ".env.development",
      production: ".env.production",
      test: ".env.test",
    };

    const file = envPathMap[process.env.NODE_ENV as keyof typeof envPathMap];

    if (file) {
      dotenv.config({ path: path.join(this.getRootDir(), file) });
    }
  }

  static getRootDir() {
    return appRoot.path
  }
}
