import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common"
import { WebhookSignatureVerifier } from "./webhook-signature-verifier"
import { HandleWebhookDto } from "./dto/handle-webhook.dto"
import { WebhookService } from "./webhook.service"


@Controller("webhook")
export class WebhookController {

  constructor(
    protected service: WebhookService
  ) {}

  @UseGuards(WebhookSignatureVerifier)
  @HttpCode(200)
  @Post("handle")
  async handle(
    @Body() dto: HandleWebhookDto
  ) {
    await this.service.process(dto)
  }
}