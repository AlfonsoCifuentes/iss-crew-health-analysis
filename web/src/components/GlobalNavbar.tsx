'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, BarChart3, Rocket, Users, Brain, FileText, Settings } from 'lucide-react';
import SettingsModal from './SettingsModal';

export default function GlobalNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Analytics', href: '/analytics', icon: Brain },
    { name: 'Simulators', href: '/simulators', icon: Rocket },
    { name: 'Astronauts', href: '/astronauts', icon: Users },
    { name: 'Reports', href: '/reports', icon: FileText },
  ];

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-yellow-500/20">
      <div className="w-full px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-12">
          
          {/* Left Side - Logo & Title */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 shrink-0">
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <Image
                  src="/images/iss_icon.png"
                  alt="ISS Icon"
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg font-bold text-cosmic-white font-orbitron">
                ISS CREW HEALTH
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Center/Right */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-2 py-1 rounded-md text-sm font-medium transition-all duration-300 font-orbitron ${
                    isActive
                      ? 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20'
                      : 'text-white/80 hover:text-yellow-400 hover:bg-yellow-400/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:block">{item.name}</span>
                </Link>
              );
            })}
            
            {/* Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 text-white/80 hover:text-yellow-400 transition-all duration-300"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile - Right Side */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 text-white/80 hover:text-yellow-400 hover:bg-yellow-400/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-400 rounded-md"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
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
            
            {/* Mobile Settings */}
            <button
              onClick={() => {
                setIsSettingsOpen(true);
                setIsOpen(false);
              }}
              className="flex items-center space-x-3 w-full px-3 py-2 rounded-md text-base font-medium transition-all duration-300 font-orbitron text-white/80 hover:text-yellow-400 hover:bg-yellow-400/5"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      )}
    </nav>
    
    {/* Settings Modal - Outside nav for proper z-index layering */}
    <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
