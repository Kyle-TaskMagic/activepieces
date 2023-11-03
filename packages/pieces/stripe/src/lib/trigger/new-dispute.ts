import { createTrigger } from '@activepieces/pieces-framework';
import { TriggerStrategy } from '@activepieces/pieces-framework';
import { stripeCommon } from '../common';
import { stripeAuth } from '../..';

export const stripeNewDispute = createTrigger({
  auth: stripeAuth,
  name: 'new_dispute',
  displayName: 'New Dispute',
  description: 'Triggers when a new dispute is created',
  props: {},
  type: TriggerStrategy.WEBHOOK,
  sampleData: stripeCommon.samples.charge,
  async onEnable(context) {
    const webhook = await stripeCommon.subscribeWebhook(
      'charge.dispute.created',
      context.webhookUrl!,
      context.auth
    );
    await context.store?.put<WebhookInformation>(
      '_charge_dispute_created_trigger',
      {
        webhookId: webhook.id,
      }
    );
  },
  async onDisable(context) {
    const response = await context.store?.get<WebhookInformation>(
      '_charge_dispute_created_trigger'
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
