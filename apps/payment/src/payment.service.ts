import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      configService.get<string>('STRIPE_PUBLISHABLE_KEY'),
    );
  }

  async createCheckoutSession(
    lookupKey: string,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    const prices = await this.stripe.prices.list({
      lookup_keys: [lookupKey],
      expand: ['data.product'],
    });

    const domain = this.configService.get<string>('DOMAIN');
    const session = await this.stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
        {
          price: prices.data[0].id,
          // For metered billing, do not pass quantity
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${domain}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}?canceled=true`,
    });

    return session;
  }

  async createCustomerPortalSession(
    sessionId: string,
  ): Promise<Stripe.Response<Stripe.BillingPortal.Session>> {
    // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
    // Typically this is stored alongside the authenticated user in your database.
    const checkoutSession =
      await this.stripe.checkout.sessions.retrieve(sessionId);

    let customer: string;
    if (typeof checkoutSession.customer === 'string')
      customer = checkoutSession.customer;
    else {
      if (checkoutSession.customer.deleted)
        throw new Error('Unable to create a portal session for a deleted user');
      customer = checkoutSession.customer.id;
    }

    // This is the url to which the customer will be redirected when they are done
    // managing their billing with the portal.
    const portalSession = await this.stripe.billingPortal.sessions.create({
      customer,
      return_url: this.configService.get<string>('DOMAIN'),
    });

    return portalSession;
  }

  processEvent(
    stripeSignature: string,
    body: Stripe.Event | string | Buffer,
  ): void {
    let event = body as Stripe.Event;

    // Replace this endpoint secret with your endpoint's unique secret
    // If you are testing with the CLI, find the secret by running 'stripe listen'
    // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
    // at https://dashboard.stripe.com/webhooks
    const endpointSecret = this.configService.get<string>(
      'STRIPE_ENDPOINT_SECRET',
    );

    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      try {
        event = this.stripe.webhooks.constructEvent(
          body as string | Buffer,
          stripeSignature,
          endpointSecret,
        );
      } catch (err) {
        this.logger.error(
          '⚠️  Webhook signature verification failed.',
          err.message,
        );
        throw new Error('⚠️  Webhook signature verification failed.');
      }
    }

    let subscription:
      | Stripe.Subscription
      | Stripe.Entitlements.ActiveEntitlementSummary;

    switch (event.type) {
      case 'customer.subscription.trial_will_end':
        subscription = event.data.object;
        this.logger.log(`Subscription status is ${subscription.status}.`);
        this.handleSubscriptionTrialEnding(subscription);
        break;
      case 'customer.subscription.deleted':
        subscription = event.data.object;
        this.logger.log(`Subscription status is ${subscription.status}.`);
        this.handleSubscriptionDeleted(subscription);
        break;
      case 'customer.subscription.created':
        subscription = event.data.object;
        this.logger.log(`Subscription status is ${subscription.status}.`);
        this.handleSubscriptionCreated(subscription);
        break;
      case 'customer.subscription.updated':
        subscription = event.data.object;
        this.logger.log(`Subscription status is ${subscription.status}.`);
        this.handleSubscriptionUpdated(subscription);
        break;
      case 'entitlements.active_entitlement_summary.updated':
        subscription = event.data.object;
        this.logger.log(
          `Active entitlement summary updated for ${subscription}.`,
        );
        this.handleEntitlementUpdated(subscription);
        break;
      default:
        this.logger.error(`Unhandled event type ${event.type}.`);
        return;
    }
  }

  private handleSubscriptionTrialEnding(subscription: Stripe.Subscription) {
    throw new Error('Function not implemented.');
  }

  private handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    throw new Error('Function not implemented.');
  }

  private handleSubscriptionCreated(subscription: Stripe.Subscription) {
    throw new Error('Function not implemented.');
  }

  private handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    throw new Error('Function not implemented.');
  }

  private handleEntitlementUpdated(
    subscription: Stripe.Entitlements.ActiveEntitlementSummary,
  ) {
    throw new Error('Function not implemented.');
  }
}
