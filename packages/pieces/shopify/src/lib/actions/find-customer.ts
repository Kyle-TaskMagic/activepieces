import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { shopifyAuth } from '../..';

export const findCustomer = createAction({
  auth: shopifyAuth,
  name: 'find_customer',
  displayName: 'Find Customer',
  description: 'Find a customer.',

  props: {
    email: Property.ShortText({
      displayName: 'Email',
      required: true,
    }),
  },

  async run(context) {
    const { email } = context.propsValue;

    const shopName = context.auth.shopName;
    const adminToken = context.auth.adminToken;

    const url = `https://${shopName}.myshopify.com/admin/api/2020-01/customers/search.json?query=email:${email}`;

    const response = await httpClient.sendRequest<{
      customer: {
        id: string;
      };
    }>({
      method: HttpMethod.GET,
      url,
      headers: {
        'X-Shopify-Access-Token': adminToken,
      },
    });

    return response.body;
  },
});
