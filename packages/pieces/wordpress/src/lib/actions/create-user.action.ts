import { createAction, Property } from '@activepieces/pieces-framework';
import {
  httpClient,
  HttpMethod,
  HttpRequest,
  AuthenticationType,
} from '@activepieces/pieces-common';
import { wordpressAuth } from '../..';

export const createWordpressUser = createAction({
  auth: wordpressAuth,
  name: 'create_user',
  displayName: 'Create User',
  description: 'Create new User on Wordpress',
  props: {
    username: Property.ShortText({
      displayName: 'Username',
      description: 'Username of the user',
      required: true,
    }),
    email: Property.ShortText({
      displayName: 'Email',
      description: 'Email of the user',
      required: true,
    }),
    first_name: Property.ShortText({
      displayName: 'First Name',
      description: 'First name of the user',
      required: true,
    }),
    last_name: Property.ShortText({
      displayName: 'Last Name',
      description: 'Last name of the user',
      required: true,
    }),
    password: Property.ShortText({
      displayName: 'Password',
      description: 'Password of the user',
      required: true,
    }),
  },
  async run(context) {
    const request: HttpRequest = {
      method: HttpMethod.POST,
      url: context.auth.website_url + '/wp-json/wp/v2/users',
      authentication: {
        type: AuthenticationType.BASIC,
        username: context.auth.username,
        password: context.auth.password,
      },
      body: {
        username: context.propsValue.username,
        email: context.propsValue.email,
        first_name: context.propsValue.first_name,
        last_name: context.propsValue.last_name,
        password: context.propsValue.password,
      },
    };
    const response = await httpClient.sendRequest(request);

    return response.body;
  },
});
