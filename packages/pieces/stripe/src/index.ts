import { PieceAuth, createPiece } from '@activepieces/pieces-framework';
import { stripeNewPayment } from './lib/trigger/new-payment';
import { stripeNewCustomer } from './lib/trigger/new-customer';
import { stripePaymentFailed } from './lib/trigger/payment-failed';
import { stripeNewSubscription } from './lib/trigger/new-subscription';
import { stripeCreateCustomer } from './lib/actions/create-customer';
import { stripeCreateInvoice } from './lib/actions/create-invoice';
import { stripeSearchCustomer } from './lib/actions/search-customer';
import { stripeCreateSubscription } from './lib/actions/create-subscription';
import { stripeSearchCharge } from './lib/actions/search-charge';
import { stripeSearchInvoice } from './lib/actions/search-invoice';
import { stripeCanceledSubscription } from './lib/trigger/canceled-subscription';
import { stripeCheckoutSessionComplete } from './lib/trigger/checkout-session-complete';
import { stripeInvoicePaymentFailed } from './lib/trigger/invoice-payment-failed';
import { stripeNewDispute } from './lib/trigger/new-dispute';
import { stripeNewInvoice } from './lib/trigger/new-invoice';
import { stripeNewRefund } from './lib/trigger/new-refund';
import { stripeUpdatedSubscription } from './lib/trigger/updated-subscription';

export const stripeAuth = PieceAuth.SecretText({
  displayName: 'Secret API Key',
  required: true,
  description: 'Secret key acquired from your Stripe dashboard',
});

export const stripe = createPiece({
  displayName: 'Stripe',
  minimumSupportedRelease: '0.5.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/stripe.png',
  authors: ['ashrafsamhouri', 'lldiegon', 'TaskMagicKyle'],
  auth: stripeAuth,
  actions: [
    stripeCreateCustomer,
    stripeCreateInvoice,
    stripeSearchCustomer,
    stripeCreateSubscription,
    stripeSearchCharge,
    stripeSearchInvoice,
  ],
  triggers: [
    stripeNewPayment,
    stripeNewCustomer,
    stripePaymentFailed,
    stripeNewSubscription,
    stripeCanceledSubscription,
    stripeCheckoutSessionComplete,
    stripeInvoicePaymentFailed,
    stripeNewDispute,
    stripeNewInvoice,
    stripeNewRefund,
    stripeUpdatedSubscription,
  ],
});
