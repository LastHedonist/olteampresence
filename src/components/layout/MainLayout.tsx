import { ReactNode, useState } from 'react';
import { Navbar } from './Navbar';

interface MainLayoutProps {
  children: ReactNode;
  onSearch?: (query: string) => void;
}

export function MainLayout({ children, onSearch }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={onSearch} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
