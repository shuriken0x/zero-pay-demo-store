import { Blockchain, FiatCurrency, Token } from "@share"
import { InvoiceStatus } from "./invoice.conts"

export type Invoice = {
  id: string
  token: Token
  blockchain: Blockchain
  address: string
  status: InvoiceStatus
  pricing: {
    fiat: {
      amount: string
      currency: FiatCurrency
    }
    crypto: {
      amount: string
      currency: Token
    }
  }
  meta: {
    comment: string
    payload: string | null
  }
  projectId: string
  expiresAt: string
}
