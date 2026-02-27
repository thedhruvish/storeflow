import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function BillingHistorySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className='h-6 w-32' />
        <Skeleton className='h-4 w-48' />
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='flex items-center gap-4 py-3'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-6 w-20' />
              <Skeleton className='h-4 w-40' />
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-4 w-32' />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton Components
function CurrentPlanSkeleton() {
  return (
    <Card className='overflow-hidden'>
      <CardHeader className='pb-4'>
        <Skeleton className='h-6 w-32' />
        <Skeleton className='h-4 w-64' />
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-6'>
          <Skeleton className='h-20 w-20 rounded-xl' />
          <div className='flex-1 space-y-3'>
            <Skeleton className='h-6 w-40' />
            <Skeleton className='h-4 w-24' />
            <div className='space-y-2 pt-2'>
              <Skeleton className='h-4 w-full max-w-xs' />
              <Skeleton className='h-4 w-full max-w-sm' />
              <Skeleton className='h-4 w-full max-w-xs' />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className='border-t pt-4 flex flex-col sm:flex-row gap-3'>
        <Skeleton className='h-10 w-full sm:w-40' />
        <Skeleton className='h-10 w-full sm:w-40' />
      </CardFooter>
    </Card>
  );
}

export function ErrorState({
  error,
  onRetry,
}: {
  error: Error | null;
  onRetry: () => void;
}) {
  return (
    <div className='flex min-h-[60vh] w-full items-center justify-center p-4'>
      <Card className='border-destructive max-w-md w-full'>
        <CardHeader className='text-center'>
          <div className='mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4'>
            <AlertCircle className='h-6 w-6 text-destructive' />
          </div>
          <CardTitle className='text-xl'>Error Loading Billing Info</CardTitle>
          <CardDescription>
            There was a problem fetching your billing details. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className='text-center'>
          <p className='text-sm text-muted-foreground mb-4'>
            {error?.message || "An unexpected error occurred"}
          </p>
          <Button onClick={onRetry} variant='outline' className='gap-2'>
            <RefreshCw className='h-4 w-4' />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function BillingPageSkeleton() {
  return (
    <div className='space-y-6 p-3 sm:p-4 md:p-6 lg:p-8'>
      <Skeleton className='h-8 w-48' />
      <CurrentPlanSkeleton />
      <BillingHistorySkeleton />
    </div>
  );
}
