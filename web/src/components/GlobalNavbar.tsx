'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, BarChart3, Rocket, Users, Brain, FileText } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '@/contexts/LocaleContext';

export default function GlobalNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  const navigation = [
    { name: t('navigation.dashboard'), href: '/dashboard', icon: BarChart3 },
    { name: t('navigation.analysis'), href: '/analysis', icon: Brain },
    { name: t('navigation.analytics'), href: '/analytics', icon: Brain },
    { name: t('navigation.simulators'), href: '/simulators', icon: Rocket },
    { name: t('navigation.astronauts'), href: '/astronauts', icon: Users },
    { name: t('navigation.reports'), href: '/reports', icon: FileText },
  ];

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-yellow-500/20">
      <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-12 gap-2 items-center h-14">
          
          {/* Logo - Columns 1-3 */}
          <div className="col-span-3 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="/images/iss_icon.png"
                  alt="ISS Icon"
                  width={28}
                  height={28}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-bold text-cosmic-white font-orbitron whitespace-nowrap hidden sm:block">
                ISS CREW
              </span>
            </Link>
          </div>

          {/* Navigation - Columns 4-10 */}
          <div className="col-span-7 hidden md:flex items-center justify-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center justify-center w-12 h-10 rounded-md text-xs font-medium transition-all duration-300 font-orbitron ${
                    isActive
                      ? 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20'
                      : 'text-white/80 hover:text-yellow-400 hover:bg-yellow-400/5'
                  }`}
                  title={item.name}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs mt-0.5 hidden lg:block">{item.name.split(' ')[0]}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side - Columns 11-12 */}
          <div className="col-span-2 flex items-center justify-end space-x-2">
            
            {/* Language Selector */}
            <div className="flex-shrink-0">
              <LanguageSelector />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-white/80 hover:text-yellow-400 hover:bg-yellow-400/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-400 rounded-md flex-shrink-0"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-black/90 backdrop-blur-md border-t border-yellow-500/20">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-all duration-300 font-orbitron ${
                    isActive
                      ? 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20'
                      : 'text-white/80 hover:text-yellow-400 hover:bg-yellow-400/5'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
    </>
  );
}
