import type { ApiSubscription } from "@/api/setting-api";

export const getStatusVariant = (
  status: ApiSubscription["status"]
): "default" | "destructive" | "secondary" | "outline" => {
  switch (status) {
    case "active":
    case "partial_active":
      return "default";
    case "cancelled":
      return "destructive";
    case "failed":
      return "destructive";
    case "paused":
      return "secondary";
    case "past_due":
      return "secondary";
    case "expired":
      return "outline";
    default:
      return "secondary";
  }
};

export const getStatusColor = (status: ApiSubscription["status"]) => {
  switch (status) {
    case "active":
    case "partial_active":
      return "text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20";
    case "cancelled":
    case "failed":
      return "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20";
    case "paused":
    case "past_due":
      return "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20";
    case "expired":
      return "text-gray-600 dark:text-gray-400 bg-gray-500/10 border-gray-500/20";
    default:
      return "text-gray-600 dark:text-gray-400 bg-gray-500/10 border-gray-500/20";
  }
};

export const getSubscriptionDetails = (sub: ApiSubscription) => {
  const startDate = new Date(sub.startDate);
  const endDate = new Date(sub.endDate);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isYearly = diffDays > 40; // Rough check, monthly is ~30, yearly ~365

  // Fallback to monthly if checking fails or something odd
  const interval = isYearly ? "year" : "month";
  const planDetails = isYearly ? sub.planId.yearly : sub.planId.monthly;

  const isStripe = sub.paymentType === "stripe";
  const price = isStripe ? planDetails.priceUSD : planDetails.priceINR;
  const currency = (isStripe ? "USD" : "INR") as "USD" | "INR";

  return { price, currency, interval, isStripe, planDetails };
};
