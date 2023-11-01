import { createTrigger } from '@activepieces/pieces-framework';
import { TriggerStrategy } from "@activepieces/pieces-framework";
import { stripeCommon } from '../common';
import { stripeAuth } from '../..';

export const stripeNewCustomer = createTrigger({
  auth: stripeAuth,
  name: 'new_customer',
  displayName: 'New Customer',
  description: 'Triggers when a new customer is created',
  props: {},
  sampleData: stripeCommon.samples.customer,
  type: TriggerStrategy.WEBHOOK,
  async onEnable(context) {
    const webhook = await stripeCommon.subscribeWebhook(
      'customer.created',
      context.webhookUrl,
      context.auth
    );
    await context.store.put<WebhookInformation>('_new_customer_trigger', {
      webhookId: webhook.id,
    });
  },
  async onDisable(context) {
    const response = await context.store?.get<WebhookInformation>(
      '_new_customer_trigger'
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
