'use client';

import React from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { cn } from '@/lib/utils';
import { adminConfig } from '@/config/admin-config';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <>
      <Header config={adminConfig.header} />
      <Sidebar tabs={adminConfig.sidebar.tabs} />
      <main
        className={cn(
          'pt-16',
          'lg:pl-64',
          'transition-all duration-300'
        )}
      >
        {children}
      </main>
    </>
  );
}

