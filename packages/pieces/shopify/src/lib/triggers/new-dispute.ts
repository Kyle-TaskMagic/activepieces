import { createShopifyWebhookTrigger } from '../common/register-webhook';

export const newDispute = createShopifyWebhookTrigger({
  name: 'new_dispute',
  description: 'Triggered when a new dispute is created',
  topic: 'disputes/create',
  displayName: 'New Dispute',
  sampleData: {
    id: 285332461850802050,
    order_id: 820982911946154500,
    type: 'chargeback',
    amount: '11.50',
    currency: 'CAD',
    reason: 'fraudulent',
    network_reason_code: '4837',
    status: 'under_review',
    evidence_due_by: '2021-12-30T19:00:00-05:00',
    evidence_sent_on: null,
    finalized_on: null,
    initiated_at: '2021-12-31T19:00:00-05:00',
  },
});
