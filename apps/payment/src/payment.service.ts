import { RmqService, RoutingKeys } from '@libs/common';
import {
  CustomerSubscriptionCreatedDto,
  SubscriptionStatus,
} from '@libs/contracts/payment';
import { Injectable, Logger, RawBodyRequest } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly rmqService: RmqService,
  ) {
    this.stripe = new Stripe(configService.get<string>('STRIPE_SECRET_KEY'));
  }

  async listPrice(
    lookupKey: string[],
  ): Promise<Stripe.Response<Stripe.ApiList<Stripe.Price>>> {
    const prices = await this.stripe.prices.list({
      lookup_keys: lookupKey,
      expand: ['data.product'],
    });
    return prices;
  }

  async createCheckoutSession(
    lookupKey: string,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    const prices = await this.stripe.prices.list({
      lookup_keys: [lookupKey],
      expand: ['data.product'],
    });
    this.logger.log(`id ${prices.data[0].id}`);

    const domain = this.configService.get<string>('DOMAIN');
    const session = await this.stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${domain}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/canceled`,
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
    const session = await this.stripe.billingPortal.sessions.create({
      customer,
      return_url: this.configService.get<string>('DOMAIN'),
    });

    this.logger.log(`Customer portal session ${JSON.stringify(session)}`);
    return session;
  }

  async processEvent(
    request: RawBodyRequest<Request>,
    // stripeSignature: string,
    // body: Stripe.Event | string | Buffer,
  ): Promise<void> {
    let event: Stripe.Event = request.body as Stripe.Event;

    // Replace this endpoint secret with your endpoint's unique secret
    // If you are testing with the CLI, find the secret by running 'stripe listen'
    // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
    // at https://dashboard.stripe.com/webhooks
    const endpointSecret = this.configService.get<string>(
      'STRIPE_ENDPOINT_SECRET',
    );

    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (!endpointSecret) {
      try {
        const signature = request.header('stripe-signature');
        event = this.stripe.webhooks.constructEvent(
          request.body,
          signature,
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

    switch (event.type) {
      case 'customer.subscription.trial_will_end':
        this.logger.log(`Subscription status is ${event.data.object.status}.`);
        this.handleSubscriptionTrialEnding(event.data.object);
        break;
      case 'customer.subscription.deleted':
        this.logger.log(`Subscription status is ${event.data.object.status}.`);
        this.handleSubscriptionDeleted(event.data.object);
        break;
      case 'customer.subscription.created':
        this.logger.log(`Subscription status is ${event.data.object.status}.`);
        await this.handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        this.logger.log(`Subscription status is ${event.data.object.status}.`);
        this.handleSubscriptionUpdated(event.data.object);
        break;
      case 'entitlements.active_entitlement_summary.updated':
        this.logger.log(
          `Active entitlement summary updated for ${event.data.object}.`,
        );
        this.handleEntitlementUpdated(event.data.object);
        break;
      default:
        this.logger.error(`Unhandled event type ${event.type}.`);
        break;
    }
  }

  private handleSubscriptionTrialEnding(subscription: Stripe.Subscription) {
    throw new Error('Function not implemented.');
  }

  private handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    throw new Error('Function not implemented.');
  }

  private async handleSubscriptionCreated(
    subscription: Stripe.Subscription,
  ): Promise<boolean> {
    const customerId = subscription.customer.toString();
    const customer = await this.stripe.customers.retrieve(customerId);
    const payload: CustomerSubscriptionCreatedDto = {
      customer: {
        id: customerId,
        email: customer.deleted
          ? undefined
          : (customer as Stripe.Customer).email,
      },
      expiresAt: new Date(subscription.current_period_end),
      status: SubscriptionStatus[subscription.status],
      claims: subscription.items.data.map((item) =>
        item.plan.product.toString(),
      ),
    };

    return this.rmqService.publish(
      RoutingKeys.payment.customerSubscription,
      payload,
      'created',
    );
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
