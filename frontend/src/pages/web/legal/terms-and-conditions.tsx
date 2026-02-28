import React from "react";
import LegalLayout from "./legal-layout";

const TermsAndConditions: React.FC = () => {
  return (
    <LegalLayout title='Terms & Conditions'>
      <p className='mb-4 text-sm opacity-70'>
        Last updated: {new Date().toDateString()}
      </p>

      <h2 className='text-xl font-medium mt-6 mb-3'>1. Acceptance of Terms</h2>
      <p className='mb-4'>
        By accessing or using storeone.cloud, you agree to be bound by these
        Terms & Conditions. If you do not agree, you must not use the service.
      </p>

      <h2 className='text-xl font-medium mt-8 mb-3'>2. Service Description</h2>
      <p className='mb-4'>
        storeone.cloud provides cloud-based digital media storage. Each account
        includes a base storage limit of 500MB unless otherwise stated in the
        subscription plan.
      </p>

      <h2 className='text-xl font-medium mt-8 mb-3'>
        3. Subscriptions & Billing
      </h2>
      <ul className='list-disc pl-6 space-y-2'>
        <li>Monthly and yearly subscription plans</li>
        <li>Automatic renewal unless canceled</li>
        <li>Payments supported in INR (USD in beta)</li>
      </ul>

      <h2 className='text-xl font-medium mt-8 mb-3'>
        4. Storage Limits & Expiry
      </h2>
      <p className='mb-4'>
        If a subscription expires and storage usage exceeds allowed limits, a
        3-day grace period is provided. After this period, excess files may be
        randomly deleted without notice.
      </p>

      <h2 className='text-xl font-medium mt-8 mb-3'>5. Prohibited Content</h2>
      <ul className='list-disc pl-6 space-y-2'>
        <li>Pornographic or sexual material</li>
        <li>Child sexual abuse material (zero tolerance)</li>
        <li>Illegal content under Indian law</li>
        <li>Copyrighted content without authorization</li>
        <li>Malware, exploits, or hacking tools</li>
      </ul>

      <h2 className='text-xl font-medium mt-8 mb-3'>
        6. Enforcement & Admin Rights
      </h2>
      <p className='mb-4'>
        The site owner may suspend accounts, remove content, or terminate access
        without prior notice if these terms are violated.
      </p>

      <h2 className='text-xl font-medium mt-8 mb-3'>7. Liability Disclaimer</h2>
      <p className='mb-4'>
        The service is provided “as is” and “as available”. We are not liable
        for data loss, service downtime, or indirect damages.
      </p>

      <h2 className='text-xl font-medium mt-8 mb-3'>8. Governing Law</h2>
      <p className='mb-4'>These terms are governed by the laws of India.</p>

      <h2 className='text-xl font-medium mt-8 mb-3'>9. Contact</h2>
      <p>support@storeone.cloud</p>
    </LegalLayout>
  );
};

export default TermsAndConditions;
