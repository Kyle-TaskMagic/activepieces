import { createAction, Property } from '@activepieces/pieces-framework';
import {
  httpClient,
  HttpMethod,
  HttpRequest,
  AuthenticationType,
} from '@activepieces/pieces-common';
import { slackAuth } from '../../';

export const slackCreateChannel = createAction({
  auth: slackAuth,
  name: 'create_channel',
  displayName: 'Create Channel',
  description: 'Creates a new channel',
  props: {
    channel_name: Property.ShortText({
      displayName: 'Channel Name',
      description: 'Name of the channel',
      required: true,
    }),
    is_private: Property.Checkbox({
      displayName: 'Private',
      description: 'Is the channel private',
      required: true,
    }),
  },
  async run(context) {
    const token = context.auth.access_token;
    const { channel_name, is_private } = context.propsValue;

    const body: CreateChannelRequestBody = {
      name: channel_name,
      is_private,
    };

    const request: HttpRequest<CreateChannelRequestBody> = {
      method: HttpMethod.POST,
      url: 'https://slack.com/api/conversations.create',
      body,
      authentication: {
        type: AuthenticationType.BEARER_TOKEN,
        token,
      },
    };

    const response = await httpClient.sendRequest(request);
    return response.body;
  },
});

type CreateChannelRequestBody = {
  name: string;
  is_private: boolean;
};
