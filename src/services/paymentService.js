// Mock payment abstraction standing in for Stripe.
// Future implementation: create a PaymentIntent server-side
// (POST /api/payments/intent), confirm it client-side with
// @stripe/stripe-js using VITE_STRIPE_PUBLISHABLE_KEY, then hand the
// confirmed intent id to orderService.create().
import { mockRequest } from "./api.js";

export const paymentService = {
  charge({ amount, method }) {
    return mockRequest(() => {
      if (method === "card_fail_test") {
        throw new Error("Card declined. Try a different payment method.");
      }
      return {
        paymentId: `pay_mock_${Date.now()}`,
        amount,
        method,
        status: "succeeded",
      };
    }, { delay: 1100 });
  },
};
