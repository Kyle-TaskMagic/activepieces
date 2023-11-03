import { createAction, Property } from '@activepieces/pieces-framework';
import {
  httpClient,
  HttpMethod,
  HttpRequest,
  AuthenticationType,
} from '@activepieces/pieces-common';
import { slackAuth } from '../../';
import { slackChannel } from '../common/props';

export const slackInviteUserToChannel = createAction({
  auth: slackAuth,
  name: 'invite_to_channel',
  displayName: 'Invite user',
  description: 'Invites a user to a channel',
  props: {
    user: Property.ShortText({
      displayName: 'User ID',
      description: 'ID of the user to invite',
      required: true,
    }),
    channel: slackChannel,
  },
  async run(context) {
    const token = context.auth.access_token;
    const { user, channel } = context.propsValue;

    const body: any = {
      user,
      channel,
    };

    const request: HttpRequest<any> = {
      method: HttpMethod.POST,
      url: 'https://slack.com/api/conversations.invite',
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
