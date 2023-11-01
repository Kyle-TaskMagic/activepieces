import { createTrigger } from '@activepieces/pieces-framework';
import { TriggerStrategy } from '@activepieces/pieces-framework';
import { stripeCommon } from '../common';
import { stripeAuth } from '../..';

export const stripeCheckoutSessionComplete = createTrigger({
  auth: stripeAuth,
  name: 'checkout_session_complete',
  displayName: 'Checkout Session Complete',
  description: 'Triggers when a checkout session is completed',
  props: {},
  sampleData: stripeCommon.samples.event,
  type: TriggerStrategy.WEBHOOK,
  async onEnable(context) {
    const webhook = await stripeCommon.subscribeWebhook(
      'checkout.session.completed',
      context.webhookUrl,
      context.auth
    );
    await context.store.put<WebhookInformation>(
      '_checkout_session_complete_trigger',
      {
        webhookId: webhook.id,
      }
    );
  },
  async onDisable(context) {
    const response = await context.store?.get<WebhookInformation>(
      '_checkout_session_complete_trigger'
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
