import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { stripeAuth } from '../..';

export const stripeSearchCharge = createAction({
  name: 'search_charge',
  auth: stripeAuth,
  displayName: 'Search Charge',
  description: 'Search for a charge in stripe by ID',
  props: {
    charge_id: Property.ShortText({
      displayName: 'Charge ID',
      description: undefined,
      required: true,
    }),
  },
  async run(context) {
    const charge = {
      id: context.propsValue.charge_id,
    };
    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: 'https://api.stripe.com/v1/charges/' + charge.id,
      headers: {
        Authorization: 'Bearer ' + context.auth,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.body;
  },
});
