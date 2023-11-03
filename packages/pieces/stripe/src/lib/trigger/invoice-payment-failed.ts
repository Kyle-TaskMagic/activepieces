import { createTrigger } from '@activepieces/pieces-framework';
import { TriggerStrategy } from '@activepieces/pieces-framework';
import { stripeCommon } from '../common';
import { stripeAuth } from '../..';

export const stripeInvoicePaymentFailed = createTrigger({
  auth: stripeAuth,
  name: 'invoice_payment_failed',
  displayName: 'Invoice Payment Failed',
  description: 'Triggers when an invoice payment fails',
  props: {},
  sampleData: stripeCommon.samples.event,
  type: TriggerStrategy.WEBHOOK,
  async onEnable(context) {
    const webhook = await stripeCommon.subscribeWebhook(
      'invoice.payment_failed',
      context.webhookUrl,
      context.auth
    );
    await context.store?.put<WebhookInformation>(
      '_invoice_payment_failed_trigger',
      {
        webhookId: webhook.id,
      }
    );
  },
  async onDisable(context) {
    const response = await context.store?.get<WebhookInformation>(
      '_invoice_payment_failed_trigger'
    );
    if (response !== null && response !== undefined) {
      await stripeCommon.unsubscribeWebhook(response.webhookId, context.auth);
    }
  },
  async run(context) {
    return [context.payload.body.data.object];
  },
});

interface WebhookInformation {
  webhookId: string;
}
