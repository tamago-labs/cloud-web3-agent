import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { User, LogOut, Settings, Menu, X, ExternalLink } from 'lucide-react';
import { signOut } from 'aws-amplify/auth';

interface DashboardHeaderProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onMobileMenuToggle, 
  isMobileMenuOpen 
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getPageTitle = () => {
    if (pathname.includes('/playground')) return 'MCP Playground';
    if (pathname.includes('/tools')) return 'Tool Configuration';
    return 'Dashboard Overview';
  };

  return (
    <header className="  backdrop-blur-sm border-b border-teal-800/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={onMobileMenuToggle}
              className="md:hidden p-2 rounded-lg text-teal-200 hover:bg-teal-800/50 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo and title */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2"> 
                <span className="hidden sm:block text-white font-semibold">Tamago Labs</span>
              </Link>
              <span className="hidden sm:block text-teal-300">|</span>
              <h1 className="text-white font-medium">{getPageTitle()}</h1>
            </div>
          </div>

          {/* Navigation (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/dashboard"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/dashboard'
                  ? 'bg-teal-600 text-white'
                  : 'text-teal-200 hover:bg-teal-800/50 hover:text-white'
              }`}
            >
              Overview
            </Link>
            <Link
              href="/dashboard/playground"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/dashboard/playground'
                  ? 'bg-teal-600 text-white'
                  : 'text-teal-200 hover:bg-teal-800/50 hover:text-white'
              }`}
            >
              Playground
            </Link>
            <Link
              href="/dashboard/tools"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/dashboard/tools'
                  ? 'bg-teal-600 text-white'
                  : 'text-teal-200 hover:bg-teal-800/50 hover:text-white'
              }`}
            >
              Tools
            </Link>
          </nav>

          {/* Right section */}
          <div className="flex items-center space-x-3">
            {/* Docs link */}
            <Link
              href="https://docs.tamagolabs.com"
              target="_blank"
              className="hidden sm:flex items-center space-x-1 px-3 py-2 text-teal-200 hover:text-white transition-colors"
            >
              <span className="text-sm">Docs</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg text-teal-200 hover:bg-teal-800/50 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:block text-sm">Account</span>
              </button>

              {/* User dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-teal-800 rounded-lg shadow-xl border border-teal-700 py-1 z-50">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      // Add settings navigation here
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-teal-100 hover:bg-teal-700 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-300 hover:bg-teal-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default DashboardHeader;