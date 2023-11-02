import {
  createAction,
  Property,
  Validators,
} from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { shopifyAuth } from '../..';

export const createCustomer = createAction({
  auth: shopifyAuth,
  name: 'create_customer',
  displayName: 'Create Customer',
  description: 'Creates a customer.',

  props: {
    email: Property.ShortText({
      displayName: 'Email',
      required: true,
    }),
    firstName: Property.ShortText({
      displayName: 'First Name',
      required: true,
    }),
    lastName: Property.ShortText({
      displayName: 'Last Name',
      required: true,
    }),
    company: Property.ShortText({
      displayName: 'Company',
      required: false,
    }),
    street_address: Property.ShortText({
      displayName: 'Street Address',
      required: false,
    }),

    street_address_2: Property.ShortText({
      displayName: 'Street Address 2',
      required: false,
    }),
    city: Property.ShortText({
      displayName: 'City',
      required: false,
    }),
    state: Property.ShortText({
      displayName: 'State/Province code',
      required: false,
    }),
    country: Property.ShortText({
      displayName: 'Country code',
      required: false,
    }),
    zipcode: Property.ShortText({
      displayName: 'Zip Code',
      required: false,
    }),

    mark_email_as_verified: Property.Checkbox({
      displayName: 'Mark Email as Verified',
      required: true,
    }),
    phone: Property.ShortText({
      displayName: 'Phone',
      required: false,
    }),
    tags: Property.ShortText({
      displayName: 'Tags',
      required: false,
    }),
    note: Property.LongText({
      displayName: 'Note',
      required: false,
    }),
    accepts_marketing: Property.Checkbox({
      displayName: 'Accepts Marketing',
      required: false,
    }),
    tax_exempt: Property.Checkbox({
      displayName: 'Tax Exempt',
      required: false,
    }),
    send_email_invite: Property.Checkbox({
      displayName: 'Send Email Invite',
      required: false,
    }),
  },

  async run(context) {
    const {
      email,
      firstName,
      lastName,
      company,
      street_address,
      street_address_2,
      city,
      state,
      country,
      zipcode,
      phone,
      tags,
      note,
      accepts_marketing = false,
      tax_exempt = false,
      send_email_invite = false,
    } = context.propsValue;

    const shopName = context.auth.shopName;
    const adminToken = context.auth.adminToken;

    const response = await httpClient.sendRequest<{
      customer: {
        id: string;
      };
    }>({
      method: HttpMethod.POST,
      url: `https://${shopName}.myshopify.com/admin/api/2023-04/customers.json`,
      headers: {
        'X-Shopify-Access-Token': adminToken,
        'Content-Type': 'application/json',
      },
      body: {
        customer: {
          email,
          first_name: firstName,
          last_name: lastName,
          company,
          addresses: [
            {
              address1: street_address,
              address2: street_address_2,
              city,
              province: state,
              country,
              zip: zipcode,
            },
          ],
          send_email_invite,
          phone,
          tags,
          note,
          accepts_marketing,
          tax_exempt,
        },
      },
    });

    return [response.body.customer];
  },
});
