import { createTrigger } from '@activepieces/pieces-framework';
import { TriggerStrategy } from "@activepieces/pieces-framework";
import { stripeCommon } from '../common';
import { stripeAuth } from '../..';

export const stripePaymentFailed = createTrigger({
  auth: stripeAuth,
  name: 'payment_failed',
  displayName: 'Payment Failed',
  description: 'Triggers when a payment fails',
  props: {},
  sampleData: stripeCommon.samples.charge,
  type: TriggerStrategy.WEBHOOK,
  async onEnable(context) {
    const webhook = await stripeCommon.subscribeWebhook(
      'charge.failed',
      context.webhookUrl,
      context.auth
    );
    await context.store?.put<WebhookInformation>('_payment_failed_trigger', {
      webhookId: webhook.id,
    });
  },
  async onDisable(context) {
    const response = await context.store?.get<WebhookInformation>(
      '_payment_failed_trigger'
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
