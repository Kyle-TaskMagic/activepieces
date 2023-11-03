import { createTrigger } from '@activepieces/pieces-framework';
import { TriggerStrategy } from '@activepieces/pieces-framework';
import { stripeCommon } from '../common';
import { stripeAuth } from '../..';

export const stripeCanceledSubscription = createTrigger({
  auth: stripeAuth,
  name: 'canceled_subscription',
  displayName: 'Canceled Subscription',
  description: 'Triggers when a subscription is canceled',
  props: {},
  sampleData: stripeCommon.samples.subscription,
  type: TriggerStrategy.WEBHOOK,
  async onEnable(context) {
    const webhook = await stripeCommon.subscribeWebhook(
      'customer.subscription.deleted',
      context.webhookUrl,
      context.auth
    );
    await context.store.put<WebhookInformation>(
      '_canceled_subscription_trigger',
      {
        webhookId: webhook.id,
      }
    );
  },
  async onDisable(context) {
    const response = await context.store?.get<WebhookInformation>(
      '_canceled_subscription_trigger'
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
