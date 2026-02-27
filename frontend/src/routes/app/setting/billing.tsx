import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BillingPageSkeleton,
  ErrorState,
} from "@/pages/profile/bills/billing-page-skeleton";
import { HistoryCard } from "@/pages/profile/bills/history-card";
import {
  getStatusColor,
  getStatusVariant,
  getSubscriptionDetails,
} from "@/pages/profile/bills/subscription-detials";
import { SubscriptionCycleDialog } from "@/pages/website/subscription-cycle-dialog";
import {
  CalendarDays,
  Database,
  Loader2,
  Package,
  AlertTriangle,
  CreditCard,
  Sparkles,
  RefreshCw,
  Pause,
  Play,
  Settings,
  Receipt,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetAllSubscriptions,
  useToggleSubscriptionPaused,
  useUpdatePaymentDetails,
  type ApiSubscription,
} from "@/api/setting-api";
import { formatCurrency, formatDate, formatFileSize } from "@/utils/functions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/app/setting/billing")({
  component: BillingSettingsPage,
});

export function BillingSettingsPage() {
  const [selectedSub, setSelectedSub] = useState<ApiSubscription | null>(null);
  // Use the hook to fetch data
  const {
    data: subscriptions,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllSubscriptions();
  const { mutate: toggleSubscriptionMutation, isPending: isTogglingPaused } =
    useToggleSubscriptionPaused();
  const {
    mutate: updatePaymentDetailsMutation,
    isPending: isPendingUpdatePaymentDetails,
  } = useUpdatePaymentDetails();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // Check if the message is the one we expect
      if (event.key === "payment_status" && event.newValue === "SUCCESS") {
        // Payment was successful!
        toast.success("Payment successful! Refreshing data.");
        localStorage.removeItem("payment_status");
        queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      }
    };

    // Add the listener
    window.addEventListener("storage", handleStorageChange);

    // Clean up the listener when the component unmounts
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [queryClient]);

  const updatePaymentDetails = () => {
    updatePaymentDetailsMutation(undefined, {
      onSuccess: (data) => {
        window.open(data.url, "_blank");
      },
    });
  };

  const today = new Date();

  let currentSubscription = subscriptions?.find((sub) => {
    const start = new Date(sub.startDate);
    const end = new Date(sub.endDate);
    const isWithinDateRange = today >= start && today <= end;
    const isActiveStatus =
      sub.status === "active" ||
      sub.status === "past_due" ||
      sub.status === "partial_active";
    return isActiveStatus && isWithinDateRange;
  });

  if (!currentSubscription && subscriptions && subscriptions.length > 0) {
    const sortedSubs = [...subscriptions].sort(
      (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
    );

    currentSubscription = sortedSubs.find((sub) =>
      ["failed", "past_due", "paused", "cancelled"].includes(sub.status)
    );

    if (!currentSubscription) {
      currentSubscription = sortedSubs[0];
    }
  }

  if (isLoading) {
    return <BillingPageSkeleton />;
  }

  if (isError) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className='space-y-8 p-3 sm:p-4 md:p-6 lg:p-8 '>
      {/* Page Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>
            Billing & Subscriptions
          </h1>
          <p className='text-muted-foreground mt-1'>
            Manage your subscription and billing history
          </p>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() => refetch()}
          className='gap-2 self-start sm:self-auto'
        >
          <RefreshCw className='h-4 w-4' />
          Refresh
        </Button>
      </div>

      {/* Current Plan Card */}
      <Card className='overflow-hidden border-2 border-border/50'>
        <CardHeader className='pb-4 bg-muted/30'>
          <div className='flex items-center gap-2'>
            <div className='p-2 rounded-lg bg-primary/10'>
              <CreditCard className='h-5 w-5 text-primary' />
            </div>
            <div>
              <CardTitle className='text-lg'>Current Plan</CardTitle>
              <CardDescription>
                Manage your active subscription and payment details
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className='pt-6'>
          {currentSubscription ? (
            (() => {
              const { price, currency, interval, isStripe } =
                getSubscriptionDetails(currentSubscription);

              const isFailed =
                currentSubscription.status === "failed" ||
                currentSubscription.status === "past_due";

              const isActive =
                currentSubscription.status === "active" ||
                currentSubscription.status === "partial_active";

              return (
                <>
                  {isFailed && (
                    <Alert variant='destructive' className='mb-6'>
                      <AlertTriangle className='h-4 w-4' />
                      <div className='ml-2 flex-1'>
                        <AlertTitle className='flex items-center gap-2'>
                          Payment Failed
                        </AlertTitle>
                        <AlertDescription className='mt-1'>
                          Your last payment for this plan failed. Please update
                          your payment method to restore access.
                        </AlertDescription>
                      </div>
                      <Button
                        variant='destructive'
                        size='sm'
                        className='shrink-0 ml-4'
                        onClick={() => {
                          const len =
                            currentSubscription.stripeSubscriptionCycle.length;
                          if (len > 0) {
                            const latestCycle =
                              currentSubscription.stripeSubscriptionCycle[
                                len - 1
                              ];
                            window.open(latestCycle.invoice_pdf);
                          } else {
                            toast.error("Could not find payment link.");
                          }
                        }}
                      >
                        Retry Payment
                      </Button>
                    </Alert>
                  )}

                  <div className='flex flex-col lg:flex-row gap-6 lg:gap-8'>
                    {/* Plan Info */}
                    <div className='flex-1 space-y-4'>
                      <div className='flex flex-wrap items-center gap-3'>
                        <h3 className='text-xl sm:text-2xl font-bold'>
                          {currentSubscription.planId.title}
                        </h3>
                        <Badge
                          variant={getStatusVariant(currentSubscription.status)}
                          className={`capitalize ${getStatusColor(currentSubscription.status)} border`}
                        >
                          {currentSubscription.status}
                        </Badge>
                      </div>

                      <div className='flex items-baseline gap-1'>
                        <span className='text-3xl sm:text-4xl font-bold text-primary'>
                          {formatCurrency(price, currency, {
                            amountInSmallestUnit: false,
                          })}
                        </span>
                        <span className='text-muted-foreground'>
                          / {interval}
                        </span>
                      </div>

                      <Separator className='my-4' />

                      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                        <div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50'>
                          <div className='p-2 rounded-md bg-primary/10'>
                            <Database className='h-4 w-4 text-primary' />
                          </div>
                          <div>
                            <p className='text-xs text-muted-foreground'>
                              Storage
                            </p>
                            <p className='font-semibold text-sm'>
                              {formatFileSize(
                                currentSubscription.planId.totalBytes
                              )}
                            </p>
                          </div>
                        </div>

                        <div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50'>
                          <div className='p-2 rounded-md bg-primary/10'>
                            <CalendarDays className='h-4 w-4 text-primary' />
                          </div>
                          <div>
                            <p className='text-xs text-muted-foreground'>
                              {isActive ? "Renews on" : "Period ends"}
                            </p>
                            <p className='font-semibold text-sm'>
                              {formatDate(currentSubscription.endDate)}
                            </p>
                          </div>
                        </div>

                        <div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50'>
                          <div className='p-2 rounded-md bg-primary/10'>
                            <Receipt className='h-4 w-4 text-primary' />
                          </div>
                          <div>
                            <p className='text-xs text-muted-foreground'>
                              Payment
                            </p>
                            <p className='font-semibold text-sm capitalize'>
                              {currentSubscription.paymentType}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className='pt-2'>
                        <p className='text-xs text-muted-foreground mb-1'>
                          Subscription ID
                        </p>
                        <code className='text-xs sm:text-sm bg-muted px-2 py-1 rounded font-mono break-all'>
                          {isStripe
                            ? currentSubscription.stripeSubscriptionId
                            : currentSubscription.razorpaySubscriptionId}
                        </code>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()
          ) : (
            <div className='flex flex-col items-center justify-center py-12 px-4 text-center'>
              <div className='h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4'>
                <Package className='h-8 w-8 text-muted-foreground' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>
                No Active Subscription
              </h3>
              <p className='text-sm text-muted-foreground max-w-sm mb-6'>
                You don&apos;t have an active subscription. Explore our plans to
                get started with premium features.
              </p>
              <Button asChild className='gap-2'>
                <Link
                  to='/pricing'
                  search={{
                    isYearly: false,
                    currency: "USD",
                  }}
                >
                  <Sparkles className='h-4 w-4' />
                  View Plans
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
        {currentSubscription && (
          <CardFooter className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t bg-muted/20 pt-4 pb-4'>
            <Button
              variant='outline'
              onClick={updatePaymentDetails}
              disabled={isPendingUpdatePaymentDetails}
              className='gap-2'
            >
              <Settings className='h-4 w-4' />
              {isPendingUpdatePaymentDetails ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Loading...
                </>
              ) : (
                "Manage Subscription"
              )}
            </Button>
            <Button
              variant={
                currentSubscription.isPauseCollection ? "default" : "outline"
              }
              onClick={() =>
                toggleSubscriptionMutation(currentSubscription._id, {
                  onSuccess: () => {
                    toast.success("Subscription toggled successfully");
                    currentSubscription.isPauseCollection =
                      !currentSubscription.isPauseCollection;
                    currentSubscription.status =
                      currentSubscription.isPauseCollection
                        ? "paused"
                        : "active";
                  },
                })
              }
              disabled={isTogglingPaused}
              className='gap-2'
            >
              {isTogglingPaused ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : currentSubscription.isPauseCollection ? (
                <Play className='h-4 w-4' />
              ) : (
                <Pause className='h-4 w-4' />
              )}
              {currentSubscription.isPauseCollection
                ? "Resume Payment"
                : "Pause Payment"}
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Billing History Card */}
      {subscriptions && (
        <HistoryCard
          subscriptions={subscriptions}
          setSelectedSub={(sub) => setSelectedSub(sub)}
        />
      )}

      <SubscriptionCycleDialog
        subscription={selectedSub}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedSub(null);
          }
        }}
      />
    </div>
  );
}
