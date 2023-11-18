import { TriggerStrategy, createTrigger } from '@activepieces/pieces-framework';
import {
  httpClient,
  HttpRequest,
  HttpMethod,
} from '@activepieces/pieces-common';
import { gumroadAuth } from '../..';

export const gumroadRegisterTrigger = ({
  eventType,
  sampleData,
}: {
  eventType: ResourceEventTypes;
  sampleData: unknown;
}) =>
  createTrigger({
    auth: gumroadAuth,
    name: `gumroad_trigger_${name}`,
    displayName: `New ${eventType}`,
    description: `Triggers when there is new ${eventType}`,
    props: {},
    sampleData,
    type: TriggerStrategy.WEBHOOK,
    async onEnable(context) {
      const access_token = context.auth;

      const request: HttpRequest = {
        method: HttpMethod.PUT,
        url: `https://api.gumroad.com/v2/resource_subscriptions`,
        body: {
          access_token,
          resource_name: eventType,
          post_url: context.webhookUrl,
        },
      };

      const response = await httpClient.sendRequest(request);

      if (response.status !== 200) {
        throw new Error(
          `Failed to register webhook for ${eventType} with status ${response.status}`
        );
      }

      await context.store.put(`gumroad_${eventType}_trigger`, response.body);
    },
    async onDisable(context) {
      const access_token = context.auth;
      const resource = (await context.store.get(
        `gumroad_${eventType}_trigger`
      )) as CreateWebhookResponse;

      const resource_id = resource.resource_subscription.id;

      const request: HttpRequest = {
        method: HttpMethod.DELETE,
        url: `https://api.gumroad.com/v2/resource_subscriptions/${resource_id}`,
        body: {
          access_token,
          resource_name: event,
          post_url: context.webhookUrl,
        },
      };

      const response = await httpClient.sendRequest(request);

      if (response.status !== 200) {
        throw new Error(
          `Failed to unregister webhook for ${event} with status ${response.status}`
        );
      }
    },
    async run() {
      return [sampleData];
    },
  });

type CreateWebhookResponse = {
  success: boolean;
  resource_subscription: CreateWebhookResponseResourceSubscription;
};

type CreateWebhookResponseResourceSubscription = {
  id: string;
  resource_name: ResourceEventTypes;
  post_url: string;
};

export type ResourceEventTypes =
  | 'sale'
  | 'refund'
  | 'dispute'
  | 'dispute_won'
  | 'cancellation'
  | 'subscription_updated'
  | 'subscription_ended'
  | 'subscription_restarted';
