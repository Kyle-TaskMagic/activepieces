import { HttpRequest, HttpMethod, AuthenticationType, httpClient } from "@activepieces/pieces-common";
import { samples } from './samples';
import { Property } from '@activepieces/pieces-framework';

export const stripeCommon = {
  samples,
  baseUrl: 'https://api.stripe.com/v1',
  subscribeWebhook: async (
    eventName: string,
    webhookUrl: string,
    apiKey: string
  ) => {
    const request: HttpRequest = {
      method: HttpMethod.POST,
      url: `${stripeCommon.baseUrl}/webhook_endpoints`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: {
        enabled_events: [eventName],
        url: webhookUrl,
      },
      authentication: {
        type: AuthenticationType.BEARER_TOKEN,
        token: apiKey,
      },
      queryParams: {},
    };

    const { body: webhook } = await httpClient.sendRequest<{ id: string }>(
      request
    );
    return webhook;
  },
  unsubscribeWebhook: async (webhookId: string, apiKey: string) => {
    const request: HttpRequest = {
      method: HttpMethod.DELETE,
      url: `${stripeCommon.baseUrl}/webhook_endpoints/${webhookId}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      authentication: {
        type: AuthenticationType.BEARER_TOKEN,
        token: apiKey,
      },
    };
    return await httpClient.sendRequest(request);
  },
  prices: Property.Dropdown<string>({
    displayName: 'Prices',
    description: 'List of Prices',
    required: true,
    refreshers: [],
    options: async ({ auth }) => {
      if (!auth) {
        return {
          disabled: true,
          options: [],
          placeholder: 'Please connect your account first',
        };
      }

      const response = await httpClient.sendRequest({
        method: HttpMethod.GET,
        url: 'https://api.stripe.com/v1/prices',
        headers: {
          Authorization: 'Bearer ' + auth,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const prices = response.body.data.map((price: StripePrice) => ({
        label: price.nickname,
        value: price.id,
      }));

      return {
        disabled: false,
        options: prices,
      };
    },
  }),
};

type StripePrice = {
  id: string;
  nickname: string;
};