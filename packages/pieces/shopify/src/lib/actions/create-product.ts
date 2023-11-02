import {
  createAction,
  Property,
  Validators,
} from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { shopifyAuth } from '../..';

export const createProduct = createAction({
  auth: shopifyAuth,
  name: 'create_product',
  displayName: 'Create Product',
  description: 'Creates a Product.',

  props: {
    title: Property.ShortText({
      displayName: 'Title',
      required: true,
    }),
    body_html: Property.LongText({
      displayName: 'Body HTML',
      required: true,
    }),
    vendor: Property.ShortText({
      displayName: 'Vendor',
      required: true,
    }),
    product_type: Property.ShortText({
      displayName: 'Product Type',
      required: true,
    }),
    status: Property.StaticDropdown({
      displayName: 'Status',
      required: true,
      options: {
        options: [
          {
            label: 'Active',
            value: 'active',
          },
          {
            label: 'Archived',
            value: 'archived',
          },
          {
            label: 'Draft',
            value: 'draft',
          },
        ],
      },
    }),
  },

  async run(context) {
    const { title, body_html, vendor, product_type, status } =
      context.propsValue;

    const shopName = context.auth.shopName;

    const url = `https://${shopName}.myshopify.com/admin/api/2023-04/products.json`;

    const response = await httpClient.sendRequest<{
      product: {
        id: string;
      };
    }>({
      method: HttpMethod.POST,
      url,
      headers: {
        'X-Shopify-Access-Token': context.auth.adminToken,
        'Content-Type': 'application/json',
      },
      body: {
        product: {
          title,
          body_html,
          vendor,
          product_type,
          status,
        },
      },
    });

    return response.body;
  },
});
