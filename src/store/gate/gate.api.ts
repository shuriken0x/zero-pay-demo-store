import { Injectable } from "@nestjs/common"
import axios from "axios"
import { Agent } from "node:https"
import ms from "ms"
import { InvoiceApi } from "./invoice/invoice.api"

@Injectable()
export class GateApi {
  protected instance = axios.create({
    baseURL: process.env.ZERO_PAY_URL,
    headers: {
      "Content-Type": "application/json",
    },
    auth: {
      username: process.env.ZERO_PAY_PROJECT_ID as string,
      password: process.env.ZERO_PAY_PROJECT_SECRET as string,
    },
    httpsAgent: new Agent({
      keepAlive: true,
      keepAliveMsecs: ms("5m"),
    }),
  })
  public invoice: InvoiceApi

  constructor() {
    this.invoice = new InvoiceApi(this.instance)
  }
}
