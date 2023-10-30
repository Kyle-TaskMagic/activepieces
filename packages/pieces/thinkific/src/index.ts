
import { createPiece, PieceAuth } from "@activepieces/pieces-framework";

export const thinkific = createPiece({
  displayName: "Thinkific",
  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.9.0',
  logoUrl: "https://cdn.activepieces.com/pieces/thinkific.png",
  authors: [],
  actions: [],
  triggers: [],
});
