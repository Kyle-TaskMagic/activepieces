import { createAction, Property } from '@activepieces/pieces-framework';
import {
  httpClient,
  HttpMethod,
  HttpRequest,
  AuthenticationType,
} from '@activepieces/pieces-common';
import { slackAuth } from '../../';

export const slackFindUserByEmail = createAction({
  auth: slackAuth,
  name: 'find_user_by_email',
  displayName: 'Find user by email',
  description: 'Finds a user to a channel',
  props: {
    email: Property.ShortText({
      displayName: 'Email',
      description: 'Email of the user to invite',
      required: true,
    }),
  },
  async run(context) {
    const token = context.auth.access_token;
    const { email } = context.propsValue;

    const request: HttpRequest = {
      method: HttpMethod.POST,
      url: 'https://slack.com/api/users.lookupByEmail',
      body: { email },
      authentication: {
        type: AuthenticationType.BEARER_TOKEN,
        token,
      },
    };

    const response = await httpClient.sendRequest(request);

    return response.body;
  },
});
