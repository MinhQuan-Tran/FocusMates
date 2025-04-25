'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Popover } from '@headlessui/react';

const Header: React.FC = () => {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image
          src="/focusmates.svg"
          alt="FocusMates logo"
          width={180}
          height={38}
          priority
        />
      </div>

      {/* Desktop + Tablet Nav */}
      <nav className="hidden sm:flex gap-6 text-sm font-medium text-gray-700">
        <Link href="/profile" className="hover:text-primary transition">
          Profile
        </Link>
        <Link href="/leaderboard" className="hover:text-primary transition">
          Leaderboard
        </Link>
      </nav>

      {/* Mobile Nav */}
      <Popover className="sm:hidden">
        <Popover.Button className="text-2xl font-bold focus:outline-none">
          ☰
        </Popover.Button>
        <Popover.Panel className="absolute right-6 top-16 bg-white border border-gray-200 shadow-md rounded-md flex flex-col px-4 py-2 gap-2 z-50">
          <Link href="/profile" className="text-sm text-gray-700 hover:text-primary transition">
            Profile
          </Link>
          <Link href="/leaderboard" className="text-sm text-gray-700 hover:text-primary transition">
            Leaderboard
          </Link>
        </Popover.Panel>
      </Popover>
    </header>
  );
};

export default Header;
