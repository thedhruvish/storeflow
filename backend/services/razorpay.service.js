import crypto from "crypto";
import { razorpay } from "../lib/razorpay.client.js";
import { getPlanByIdService } from "./billing.service.js";
import Refund from "../models/Refund.model.js";
import { PAYMENT_GETWAY } from "../constants/constant.js";
import { descreesStorage } from "./auth.service.js";

// create order
export const createRazorpaySubscription = async ({ planId, user, billing }) => {
  const plan = await getPlanByIdService(planId);

  const razorpayPlanId =
    billing === "yearly" ? plan.yearly.razorpayId : plan.monthly.razorpayId;

  const subscription = await razorpay.subscriptions.create({
    plan_id: razorpayPlanId,
    total_count: 100,
    customer_notify: 1,
    notify_info: {
      notify_email: user.email,
      notify_phone: user?.phone,
    },
    quantity: 1,
    notes: {
      userId: user._id,
      planId: planId,
      billing,
    },
  });

  return subscription;
};

// Create a plan
export const createRazorpayPlan = async ({
  name,
  description,
  amount,
  interval,
  notes,
}) => {
  const plan = await razorpay.plans.create({
    period: interval === "month" ? "monthly" : "yearly",
    interval: 1,
    item: {
      name,
      amount: amount * 100,
      currency: "INR",
      description,
    },
    notes,
  });
  return plan;
};

// Cancel a subscription
export const cancelRazorpaySubscription = async (subscriptionId) => {
  const subscription = await razorpay.subscriptions.cancel(subscriptionId);
  return subscription;
};

// Retrieve a subscription
export const retrieveRazorpaySubscription = async (subscriptionId) => {
  const subscription = await razorpay.subscriptions.fetch(subscriptionId);
  return subscription;
};

// paused a  subscription
export const pauseRazorpaySubscription = async (subscriptionId) => {
  const subscription = await razorpay.subscriptions.pause(subscriptionId, {
    pause_at: "now",
  });
  return subscription;
};
// resume sub
export const resumeRazorpaySubscription = async (subscriptionId) => {
  const subscription = await razorpay.subscriptions.resume(subscriptionId, {
    resume_at: "now",
  });
  return subscription;
};

// cancel immediately sub
export const cancelSubscription = async (
  subscriptionId,
  cancel_at_cycle_end = false,
) => {
  const response = await razorpay.subscriptions.cancel(subscriptionId, {
    cancel_at_cycle_end,
  });

  return response;
};

// refund payment
export const refundPayment = async (paymentId, amount) => {
  const refund = await razorpay.payments.refund(paymentId, {
    amount: amount * 100,
  });
  return refund;
};

const getLastSubscriptionPayment = async (subscriptionId) => {
  const payments = await razorpay.payments.all({
    subscription_id: subscriptionId,
    count: 1,
  });

  if (!payments.items.length) {
    throw new Error("No payment found for this subscription");
  }

  return payments.items[0]; // latest payment
};

// cancel  +  refund
export const cancelAndRefundSubscription = async (
  subscription,
  isImmediately,
) => {
  const subscriptionId = subscription.razorpaySubscriptionId;

  const [_, payment] = await Promise.all([
    cancelSubscription(subscriptionId),
    getLastSubscriptionPayment(subscriptionId),
  ]);

  if (isImmediately) {
    // count the payment how amount it refund
    const amount = await calculatorRefundAmount(subscription);

    await Promise.all([
      refundPayment(payment.id, amount),
      Refund.create({
        amount: amount,
        paymentType: PAYMENT_GETWAY[1],
        policy: "prorated",
        subscriptionId: subscription._id,
        planId: subscription.planId._id,
        currency: "INR",
      }),
      descreesStorage(subscription.userId, -subscription.planId.totalBytes),
    ]);
  }

  return {
    subscriptionId,
    paymentId: payment.id,
  };
};

export const calculatorRefundAmount = async (subscription) => {
  let amount;
  const subscriptionFullDetails = await retrieveRazorpaySubscription(
    subscription.razorpaySubscriptionId,
  );
  let planDetails;
  if (
    subscriptionFullDetails.plan_id === subscription.planId.monthly.razorpayId
  ) {
    planDetails = subscription.planId.monthly;
  } else if (
    subscriptionFullDetails.plan_id === subscription.planId.yearly.razorpayId
  ) {
    planDetails = subscription.planId.yearly;
  }
  const cycleStart = subscriptionFullDetails.current_start;
  const cycleEnd = subscriptionFullDetails.current_end;
  const now = Math.floor(Date.now() / 1000);

  // refund
  const paidAmount = planDetails.priceINR;

  if (now >= cycleEnd) {
    amount = 0; // No refund
  } else {
    const totalCycleSeconds = cycleEnd - cycleStart;
    const usedSeconds = now - cycleStart;
    const remainingSeconds = totalCycleSeconds - usedSeconds + 86400; // add extra 1 day to used

    const refundAmount = (remainingSeconds / totalCycleSeconds) * paidAmount;

    amount = Math.max(0, Math.round(refundAmount));
  }

  return amount;
};

export const updatePaymentDetails = async (
  subscriptionId,
  reason = "User send a request",
) => {
  const response = await razorpay.subscriptions.update(subscriptionId, {
    // optional
    customer_notify: 1,
    notes: {
      reason,
    },
  });

  return response;
};
// verify webhook signature
export const verifyRazorpaySignature = (
  paymentId,
  subscriptionId,
  signature,
) => {
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(paymentId + "|" + subscriptionId)
    .digest("hex");

  return generated_signature === signature;
};
