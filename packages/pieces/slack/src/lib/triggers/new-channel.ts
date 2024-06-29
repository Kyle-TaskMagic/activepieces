import { TriggerStrategy, createTrigger } from '@activepieces/pieces-framework';
import { slackAuth } from '../../';

const sampleData = {
  type: 'channel_created',
  channel: {
    id: 'C02ELGNBH',
    name: 'fun',
    is_channel: true,
    created: 1626787984,
    is_archived: false,
    is_general: false,
    unlinked: 0,
    creator: 'U02ELGNC6',
    name_normalized: 'fun',
    is_shared: false,
    is_org_shared: false,
    is_member: true,
    is_private: false,
    is_mpim: false,
    last_read: '1626787984.000100',
    latest: null,
    unread_count: 0,
    unread_count_display: 0,
    members: ['U02ELGNC6'],
    topic: { value: '', creator: '', last_set: 0 },
    purpose: { value: '', creator: '', last_set: 0 },
    previous_names: [],
    priority: 0,
  },
};

export const newChannel = createTrigger({
  auth: slackAuth,
  name: 'new_channel',
  displayName: 'New Channel',
  description: 'Triggers when a new channel is created',
  props: {},
  type: TriggerStrategy.APP_WEBHOOK,
  sampleData: sampleData,
  onEnable: async (context) => {
    await context.app.createListeners({
      events: ['channel_created'],
      identifierValue: context.auth.data['team_id'],
    });
  },
  onDisable: async () => {
    // Ignored
  },
  test: async () => {
    return [sampleData];
  },
  run: async (context) => {
    return [context.payload.body.event];
  },
});
