import { TriggerStrategy, createTrigger } from '@activepieces/pieces-framework';
import { slackAuth } from '../../';

const sampleData = {
  user: {
    id: 'U1234567',
    team_id: 'T1234567',
    name: 'some-user',
    deleted: false,
    color: '4bbe2e',
    real_name: 'Some User',
    tz: 'America/Los_Angeles',
    tz_label: 'Pacific Daylight Time',
    tz_offset: -25200,
    profile: {
      title: '',
      phone: '',
      skype: '',
      real_name: 'Some User',
      real_name_normalized: 'Some User',
      display_name: '',
      display_name_normalized: '',
      fields: {},
      status_text: 'riding a train',
      status_emoji: ':mountain_railway:',
      status_emoji_display_info: [],
      status_expiration: 0,
      avatar_hash: 'g12345678910',
      first_name: 'Some',
      last_name: 'User',
      image_24:
        'https://secure.gravatar.com/avatar/cb0c2b2ca5e8de16be31a55a734d0f31.jpg?s=24&d=https%3A%2F%2Fdev.slack.com%2Fdev-cdn%2Fv1648136338%2Fimg%2Favatars%2Fuser_shapes%2Fava_0001-24.png',
      image_32:
        'https://secure.gravatar.com/avatar/cb0c2b2ca5e8de16be31a55a734d0f31.jpg?s=32&d=https%3A%2F%2Fdev.slack.com%2Fdev-cdn%2Fv1648136338%2Fimg%2Favatars%2Fuser_shapes%2Fava_0001-32.png',
      image_48:
        'https://secure.gravatar.com/avatar/cb0c2b2ca5e8de16be31a55a734d0f31.jpg?s=48&d=https%3A%2F%2Fdev.slack.com%2Fdev-cdn%2Fv1648136338%2Fimg%2Favatars%2Fuser_shapes%2Fava_0001-48.png',
      image_72:
        'https://secure.gravatar.com/avatar/cb0c2b2ca5e8de16be31a55a734d0f31.jpg?s=72&d=https%3A%2F%2Fdev.slack.com%2Fdev-cdn%2Fv1648136338%2Fimg%2Favatars%2Fuser_shapes%2Fava_0001-72.png',
      image_192:
        'https://secure.gravatar.com/avatar/cb0c2b2ca5e8de16be31a55a734d0f31.jpg?s=192&d=https%3A%2F%2Fdev.slack.com%2Fdev-cdn%2Fv1648136338%2Fimg%2Favatars%2Fuser_shapes%2Fava_0001-192.png',
      image_512:
        'https://secure.gravatar.com/avatar/cb0c2b2ca5e8de16be31a55a734d0f31.jpg?s=512&d=https%3A%2F%2Fdev.slack.com%2Fdev-cdn%2Fv1648136338%2Fimg%2Favatars%2Fuser_shapes%2Fava_0001-512.png',
      status_text_canonical: '',
      team: 'T1234567',
    },
    is_admin: false,
    is_owner: false,
    is_primary_owner: false,
    is_restricted: false,
    is_ultra_restricted: false,
    is_bot: false,
    is_app_user: false,
    updated: 1648596421,
    is_email_confirmed: true,
    who_can_share_contact_card: 'EVERYONE',
    locale: 'en-US',
  },
  cache_ts: 1648596421,
  type: 'user_change',
  event_ts: '1648596712.000001',
};

export const newUser = createTrigger({
  auth: slackAuth,
  name: 'new_user',
  displayName: 'Updated User',
  description:
    'Triggers when a user in your org changes (added/updated/deleted)',
  props: {},
  type: TriggerStrategy.APP_WEBHOOK,
  sampleData: sampleData,
  onEnable: async (context) => {
    await context.app.createListeners({
      events: ['user_change'],
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
