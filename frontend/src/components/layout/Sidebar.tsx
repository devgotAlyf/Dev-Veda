'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PenTool, FileText, Settings, GraduationCap } from 'lucide-react';

export const SIDEBAR_WIDTH = 240;

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Create Assessment', href: '/create', icon: <PenTool size={20} /> },
    { name: 'My Assignments', href: '/assignments', icon: <FileText size={20} /> },
    { name: 'Settings', href: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col fixed top-0 left-0 h-screen w-[${SIDEBAR_WIDTH}px] bg-navy-800 z-40 border-r border-navy-700`}>
        <Link href="/" className="py-8 px-6 flex items-center gap-2 border-b border-navy-700 hover:bg-navy-700/20 transition-colors">
          <GraduationCap className="text-amber" size={32} />
          <span className="font-serif font-black text-2xl text-cream tracking-wide">VedaAI</span>
        </Link>
        
        <nav className="flex-1 pt-6 px-3 flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href) && link.href !== '#';
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200 group relative ${
                  isActive 
                    ? 'text-cream bg-navy-700/50' 
                    : 'text-cream/60 hover:text-cream hover:bg-navy-700/30'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber rounded-r-full" />
                )}
                <span className={`${isActive ? 'text-amber' : 'group-hover:text-amber/70'} transition-colors`}>
                  {link.icon}
                </span>
                <span className="font-medium text-sm">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-navy-800 z-50 border-t border-navy-700 flex items-center justify-around px-2">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href) && link.href !== '#';
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-amber' : 'text-cream/60'
              }`}
            >
              {link.icon}
              <span className="text-[10px] font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
