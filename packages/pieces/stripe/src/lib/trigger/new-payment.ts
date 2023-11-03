import { createTrigger } from '@activepieces/pieces-framework';
import { TriggerStrategy } from "@activepieces/pieces-framework";
import { stripeCommon } from '../common';
import { stripeAuth } from '../..';

export const stripeNewPayment = createTrigger({
  auth: stripeAuth,
  name: 'new_payment',
  displayName: 'New Payment',
  description: 'Triggers when a new payment is made',
  props: {},
  type: TriggerStrategy.WEBHOOK,
  sampleData: stripeCommon.samples.charge,
  async onEnable(context) {
    const webhook = await stripeCommon.subscribeWebhook(
      'charge.succeeded',
      context.webhookUrl!,
      context.auth
    );
    await context.store?.put<WebhookInformation>('_new_payment_trigger', {
      webhookId: webhook.id,
    });
  },
  async onDisable(context) {
    const response = await context.store?.get<WebhookInformation>(
      '_new_payment_trigger'
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
