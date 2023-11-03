import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { stripeAuth } from '../..';
import { stripeCommon } from '../common';

export const stripeCreateSubscription = createAction({
  name: 'create_subscription',
  auth: stripeAuth,
  displayName: 'Create Subscription',
  description: 'Create a subscription in stripe',
  props: {
    customer_id: Property.ShortText({
      displayName: 'Customer ID',
      description: 'Stripe Customer ID',
      required: true,
    }),
    price_id: stripeCommon.prices,
    quantity: Property.Number({
      displayName: 'Quantity',
      description: 'Quantity of the subscription',
      required: true,
    }),
  },
  async run(context) {
    const subscription = {
      customer: context.propsValue.customer_id,
      items: [
        {
          price: context.propsValue.price_id,
          quantity: context.propsValue.quantity,
        },
      ],
    };

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: 'https://api.stripe.com/v1/invoices',
      headers: {
        Authorization: 'Bearer ' + context.auth,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: {
        customer: subscription.customer,
        items: subscription.items,
      },
    });
    return response.body;
  },
});
