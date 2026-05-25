export class Env {
  public static getCurrent() {
    if (typeof process !== "undefined" && process.env.NODE_ENV) {
      return process.env.NODE_ENV
    }

    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_NODE_ENV) {
      return process.env.NEXT_PUBLIC_NODE_ENV
    }

    throw new Error(`Provide NODE_ENV`)
  }

  static isProduction(): boolean {
    return this.getCurrent() === "production"
  }

  static isDevelopment(): boolean {
    return this.getCurrent() === "development"
  }

  static isTest(): boolean {
    return this.getCurrent() === "test"
  }

  static isStaging(): boolean {
    return this.getCurrent() === "staging"
  }
}
