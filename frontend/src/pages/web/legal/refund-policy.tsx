import React from "react";
import LegalLayout from "./legal-layout";

const RefundPolicy: React.FC = () => {
  return (
    <LegalLayout title='Refund Policy'>
      <p className='mb-4 text-sm opacity-70'>
        Last updated: {new Date().toDateString()}
      </p>

      <h2 className='text-xl font-medium mt-6 mb-3'>1. General Policy</h2>
      <p className='mb-4'>
        storeone.cloud offers partial refunds based on unused subscription time.
        Refunds are not guaranteed and are subject to review.
      </p>

      <h2 className='text-xl font-medium mt-8 mb-3'>
        2. Used Period Deduction
      </h2>
      <p className='mb-4'>
        Charges for used subscription days plus one additional day are
        non-refundable. Applicable taxes are also non-refundable.
      </p>

      <h2 className='text-xl font-medium mt-8 mb-3'>3. Partial Refunds</h2>
      <p className='mb-4'>
        Only unused days remaining in the billing cycle may be refunded after
        deductions.
      </p>
      <h2 className='text-xl font-medium mt-8 mb-3'>4. Refund Eligibility</h2>
      <p className='mb-4'>
        Refunds are calculated based on unused subscription days. Charges for
        used days plus one additional day are non-refundable.
      </p>
      <h2 className='text-xl font-medium mt-8 mb-3'>5. No Full Refunds</h2>
      <p className='mb-4'>
        Full refunds are not provided once the service has been accessed or
        used.
      </p>

      <h2 className='text-xl font-medium mt-8 mb-3'>6. Refund Processing</h2>
      <p className='mb-4'>
        Approved refunds are processed to the original payment method and may
        take time depending on the payment provider.
      </p>
      <h2 className='text-xl font-medium mt-8 mb-3'>7. Payment Failures</h2>
      <p className='mb-4'>
        Payment failures may receive a short grace period. Continued failure may
        result in suspension or termination.
      </p>

      <h2 className='text-xl font-medium mt-8 mb-3'>8. Contact</h2>
      <p>support@storeone.cloud</p>
    </LegalLayout>
  );
};

export default RefundPolicy;
