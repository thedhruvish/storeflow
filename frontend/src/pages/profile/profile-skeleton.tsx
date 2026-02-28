import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileHeaderSkeleton() {
  return (
    <Card className='overflow-hidden'>
      <CardContent className='p-4 sm:p-6'>
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center justify-between'>
          <div className='flex items-center gap-4 sm:gap-5'>
            <Skeleton className='h-16 w-16 sm:h-20 sm:w-20 rounded-full' />
            <div className='space-y-2'>
              <Skeleton className='h-6 w-32' />
              <Skeleton className='h-4 w-48' />
            </div>
          </div>
          <div className='w-full sm:max-w-xs space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-2.5 w-full' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SecuritySettingsSkeleton() {
  return (
    <div className='space-y-6'>
      <Skeleton className='h-6 w-40' />
      <Card>
        <CardContent className='p-4 space-y-4'>
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-12 w-full' />
        </CardContent>
      </Card>
    </div>
  );
}

export function ActiveSessionsSkeleton() {
  return (
    <div className='space-y-6'>
      <Skeleton className='h-6 w-32' />
      <Card>
        <CardContent className='p-4 space-y-4'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='flex items-center gap-4'>
              <Skeleton className='h-10 w-10 rounded-full' />
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-3 w-48' />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function BackupDataSkeleton() {
  return (
    <div className='space-y-6'>
      <Skeleton className='h-6 w-32' />
      <Card>
        <CardContent className='p-4 sm:p-6'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <div className='flex items-center gap-4'>
              <Skeleton className='h-12 w-12 rounded-xl' />
              <div className='space-y-2'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-3 w-48' />
              </div>
            </div>
            <Skeleton className='h-9 w-28' />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function DangerZoneSkeleton() {
  return (
    <div className='space-y-6'>
      <Skeleton className='h-6 w-28' />
      <Card className='border-destructive/50'>
        <CardContent className='p-4 sm:p-6 space-y-4'>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'
            >
              <div className='space-y-1'>
                <Skeleton className='h-4 w-28' />
                <Skeleton className='h-3 w-48' />
              </div>
              <Skeleton className='h-9 w-28' />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function ProfilePageSkeleton() {
  return (
    <div className='flex flex-col gap-4 sm:gap-6 p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto'>
      <ProfileHeaderSkeleton />
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start'>
        <div className='lg:col-span-1 space-y-4 sm:space-y-6'>
          <SecuritySettingsSkeleton />
        </div>
        <div className='lg:col-span-2 space-y-4 sm:space-y-6'>
          <ActiveSessionsSkeleton />
          <BackupDataSkeleton />
          <DangerZoneSkeleton />
        </div>
      </div>
    </div>
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
          <CardTitle className='text-xl'>Error Loading Profile</CardTitle>
          <CardDescription>
            There was a problem loading your profile information. Please try
            again.
          </CardDescription>
        </CardHeader>
        <CardContent className='text-center'>
          <p className='text-sm text-muted-foreground mb-4'>
            {error?.message || "An unexpected error occurred"}
          </p>
          <Button onClick={onRetry} variant='outline' className='gap-2'>
            <Loader2 className='h-4 w-4' />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
