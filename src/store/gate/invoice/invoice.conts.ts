export enum InvoiceStatus {
  Pending = "pending",
  PaidPartially = "paid-partially",
  Paid = "paid",
  OverPaid = "overpaid",
  Expired = "expired",
}

export enum InvoiceEvent {
  PendingPayment = "invoice:payment:pending",
  ConfirmedPayment = "invoice:payment:confirmed",
  FailedPayment = "invoice:payment:failed",
  Expired = "invoice:expired",
}

export enum InvoicePaymentStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  Failed = "failed",
}
