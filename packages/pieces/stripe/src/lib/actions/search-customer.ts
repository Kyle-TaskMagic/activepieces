import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { stripeAuth } from '../..';

export const stripeSearchCustomer = createAction({
  name: 'search_customer',
  auth: stripeAuth,
  displayName: 'Search Customer',
  description: 'Search for a customer in stripe by email or ID',
  props: {
    email: Property.ShortText({
      displayName: 'Email or ID',
      description: "Enter the customer's email or ID",
      required: true,
    }),
  },
  async run(context) {
    const emailOrId = context.propsValue.email;
    let query = '';

    if (emailOrId.startsWith('cus_')) {
      // Assume it’s an ID if it starts with "cus_"
      query = `id:"${emailOrId}"`;
    } else {
      query = `email:"${emailOrId}"`;
    }

    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: 'https://api.stripe.com/v1/customers/search',
      headers: {
        Authorization: 'Bearer ' + context.auth,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      queryParams: {
        query: query,
      },
    });
    return response.body;
  },
});
