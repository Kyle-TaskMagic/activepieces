import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { stripeAuth } from '../..';

export const stripeSearchInvoice = createAction({
  name: 'search_invoice',
  auth: stripeAuth,
  displayName: 'Search Invoice',
  description: 'Search for an invoice in stripe by ID',
  props: {
    invoice_id: Property.ShortText({
      displayName: 'Invoice ID',
      description: undefined,
      required: true,
    }),
  },
  async run(context) {
    const invoice = {
      id: context.propsValue.invoice_id,
    };
    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: 'https://api.stripe.com/v1/invoices/' + invoice.id,
      headers: {
        Authorization: 'Bearer ' + context.auth,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.body;
  },
});
