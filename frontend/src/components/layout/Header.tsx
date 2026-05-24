'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export const Header: React.FC = () => {
  const pathname = usePathname();
  
  // Format pathname for breadcrumb (e.g., /create -> Create, /result/123 -> Result)
  const getBreadcrumb = () => {
    if (pathname === '/') return 'Home';
    const parts = pathname.split('/').filter(Boolean);
    const mainSection = parts[0];
    return mainSection.charAt(0).toUpperCase() + mainSection.slice(1);
  };

  return (
    <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur-md border-b border-ink/12 h-16 flex items-center justify-between px-6 md:px-10">
      <div className="flex items-center">
        <h2 className="font-serif font-bold text-navy text-lg tracking-wide">
          {getBreadcrumb()}
        </h2>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center text-cream font-bold text-sm select-none shadow-sm cursor-pointer hover:bg-navy-800 transition-colors">
          VA
        </div>
      </div>
    </header>
  );
};
