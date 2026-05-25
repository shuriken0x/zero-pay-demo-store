import { Blockchain, FiatCurrency, Token } from "@share"
import { Invoice } from "./invoice"
import { AxiosInstance } from "axios"


export class InvoiceApi {
  constructor(protected instance: AxiosInstance) {}

  async create(params: CreateInvoiceParams) {
    const resp = await this.instance.post("api/invoice/create", params)
    return resp.data as Invoice
  }
}

type CreateInvoiceParams = {
  token: Token
  blockchain: Blockchain
  fiat: {
    currency: FiatCurrency
    price: number
  }
  payload: string | null
}