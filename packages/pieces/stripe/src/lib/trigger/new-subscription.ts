import { createTrigger } from '@activepieces/pieces-framework';
import { TriggerStrategy } from "@activepieces/pieces-framework";
import { stripeCommon } from '../common';
import { stripeAuth } from '../..';

export const stripeNewSubscription = createTrigger({
  auth: stripeAuth,
  name: 'new_subscription',
  displayName: 'New Subscription',
  description: 'Triggers when a new subscription is made',
  props: {},
  type: TriggerStrategy.WEBHOOK,
  sampleData: stripeCommon.samples.subscription,
  async onEnable(context) {
    const webhook = await stripeCommon.subscribeWebhook(
      'customer.subscription.created',
      context.webhookUrl!,
      context.auth
    );
    await context.store?.put<WebhookInformation>(
      '_new_customer_subscription_trigger',
      {
        webhookId: webhook.id,
      }
    );
  },
  async onDisable(context) {
    const response = await context.store?.get<WebhookInformation>(
      '_new_customer_subscription_trigger'
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
