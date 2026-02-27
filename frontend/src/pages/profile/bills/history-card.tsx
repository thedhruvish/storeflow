import { CreditCard, History } from "lucide-react";
import type { ApiSubscription } from "@/api/setting-api";
import { formatCurrency, formatDate } from "@/utils/functions";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getStatusColor,
  getStatusVariant,
  getSubscriptionDetails,
} from "./subscription-detials";

interface HistoryCardProps {
  subscriptions: ApiSubscription[];
  setSelectedSub: (sub: ApiSubscription) => void;
}

export const HistoryCard = ({
  subscriptions,
  setSelectedSub,
}: HistoryCardProps) => {
  return (
    <Card className='overflow-hidden'>
      <CardHeader className='pb-4 bg-muted/30'>
        <div className='flex items-center gap-2'>
          <div className='p-2 rounded-lg bg-primary/10'>
            <History className='h-5 w-5 text-primary' />
          </div>
          <div>
            <CardTitle className='text-lg'>Billing History</CardTitle>
            <CardDescription>
              View all your previous subscription details
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className='pt-6'>
        <div className='overflow-x-auto -mx-6 px-6'>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='w-45'>Plan</TableHead>
                <TableHead className='w-25'>Status</TableHead>
                <TableHead className='w-50 hidden sm:table-cell'>
                  Period
                </TableHead>
                <TableHead className='w-30 hidden md:table-cell'>
                  Payment
                </TableHead>
                <TableHead className='w-25'>Price</TableHead>
                <TableHead className='hidden lg:table-cell'>
                  Subscription ID
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.length > 0 ? (
                subscriptions.map((sub) => {
                  const hasCycleData =
                    sub.paymentType === "stripe" &&
                    sub.stripeSubscriptionCycle?.length > 0;

                  const { price, currency, interval } =
                    getSubscriptionDetails(sub);

                  return (
                    <TableRow
                      key={sub._id}
                      onClick={() =>
                        (hasCycleData || sub.paymentType === "razorpay") &&
                        setSelectedSub(sub)
                      }
                      className={`${
                        hasCycleData || sub.paymentType === "razorpay"
                          ? "cursor-pointer hover:bg-muted/50"
                          : ""
                      } transition-colors`}
                    >
                      <TableCell>
                        <div className='font-medium'>{sub.planId.title}</div>
                        <div className='text-xs text-muted-foreground capitalize'>
                          {interval}ly
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusVariant(sub.status)}
                          className={`capitalize text-xs ${getStatusColor(sub.status)} border`}
                        >
                          {sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell className='hidden sm:table-cell'>
                        <div className='text-sm'>
                          {formatDate(sub.startDate)}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          to {formatDate(sub.endDate)}
                        </div>
                      </TableCell>
                      <TableCell className='capitalize hidden md:table-cell'>
                        <div className='flex items-center gap-2'>
                          <CreditCard className='h-3.5 w-3.5 text-muted-foreground' />
                          {sub.paymentType}
                        </div>
                      </TableCell>
                      <TableCell className='font-medium'>
                        {formatCurrency(price, currency, {
                          amountInSmallestUnit: false,
                        })}
                      </TableCell>
                      <TableCell className='hidden lg:table-cell'>
                        <code className='text-xs font-mono bg-muted px-2 py-1 rounded break-all'>
                          {sub.paymentType === "stripe"
                            ? sub.stripeSubscriptionId
                            : sub.razorpaySubscriptionId || "N/A"}
                        </code>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className='text-center py-8 text-muted-foreground'
                  >
                    <div className='flex flex-col items-center gap-2'>
                      <History className='h-8 w-8 text-muted-foreground/50' />
                      <p>No billing history found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
