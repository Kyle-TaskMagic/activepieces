import { createPiece, PieceAuth } from '@activepieces/pieces-framework';

import { gumroadTriggers } from './lib/triggers';

export const gumroadAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  required: true,
  description: `
    To obtain your access token, follow these steps:

    1. Login to GumRoad
    2. Click Settings
    3. Click Advanced
    4. Create an application with any name. Enter https://apps.taskmagic.com as your redirect URI
    5. Click Create application then scroll down briefly and click Generate Access Token
    `,
});

export const gumroad = createPiece({
  displayName: 'Gumroad',
  auth: gumroadAuth,
  minimumSupportedRelease: '0.9.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/gumroad.png',
  authors: ['TaskMagicKyle'],
  actions: [],
  triggers: gumroadTriggers,
});
