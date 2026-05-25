import { CanActivate, ExecutionContext, Injectable, Logger, RawBodyRequest } from "@nestjs/common"
import crypto from "crypto"
import { Request } from "express"

@Injectable()
export class WebhookSignatureVerifier implements CanActivate {
  protected logger = new Logger(WebhookSignatureVerifier.name)
  protected static readonly signatureHeader = "X-Webhook-Signature" as string
  protected static readonly secret = Buffer.from(process.env.ZERO_PAY_PROJECT_SECRET as string, "hex")

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RawBodyRequest<Request>>()

    if (!req.rawBody) {
      this.logger.error(`Cannot validate webhook message because req.rawBody is undefined`)
      return false
    }

    const signatureHeader = req.header(WebhookSignatureVerifier.signatureHeader)
    if (!signatureHeader) {
      return false
    }

    const message = req.rawBody
    const computedSignature = WebhookSignatureVerifier.computeMessageSignature(message, WebhookSignatureVerifier.secret)

    return crypto.timingSafeEqual(Buffer.from(signatureHeader, "hex"), Buffer.from(computedSignature, "hex"))
    // return signatureHeader === computedSignature
  }

  public static computeMessageSignature(message: Buffer, apiSecret: Buffer) {
    return crypto.createHmac(`sha256`, apiSecret).update(message).digest(`hex`)
  }
}
