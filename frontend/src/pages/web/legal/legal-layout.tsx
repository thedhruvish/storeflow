import React from "react";

type Props = {
  title: string;
  children: React.ReactNode;
};

const LegalLayout: React.FC<Props> = ({ title, children }) => {
  return (
    <main className='min-h-screen px-4 py-16'>
      <section className='mx-auto max-w-4xl rounded-xl border p-6 md:p-10'>
        <h1 className='text-3xl font-semibold mb-6'>{title}</h1>
        {children}
      </section>
    </main>
  );
};

export default LegalLayout;
