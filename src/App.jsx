
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import AccountingDashboard from '@/components/AccountingDashboard';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-foreground p-4 sm:p-6 lg:p-8">
      <Toaster />
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center gradient-text">
          ContAI Accounting
        </h1>
        <p className="text-center text-lg text-gray-300 mt-2">
          Smart accounting for your business.
        </p>
      </header>
      <main>
        <AccountingDashboard />
      </main>
      <footer className="mt-12 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} ContAI. All rights reserved.</p>
        <p>Powered by React, TailwindCSS, and Framer Motion.</p>
      </footer>
    </div>
  );
};

export default App;
