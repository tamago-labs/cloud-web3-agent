// /components/Dashboard/Layout/DashboardSidebar.tsx
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  ExternalLink,
  Book,
  Home
} from 'lucide-react';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: pathname === '/dashboard'
    },
    {
      name: 'Playground', 
      href: '/dashboard/playground',
      icon: MessageSquare,
      current: pathname === '/dashboard/playground'
    },
    {
      name: 'Tools',
      href: '/dashboard/tools', 
      icon: Settings,
      current: pathname === '/dashboard/tools'
    }
  ];

  const externalLinks = [
    {
      name: 'Documentation',
      href: 'https://docs.tamagolabs.com',
      icon: Book
    },
    {
      name: 'Back to Home',
      href: '/',
      icon: Home
    }
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-teal-900/95 backdrop-blur-sm border-r border-teal-800/50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-teal-800/50">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-white font-semibold">Tamago Labs</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      item.current
                        ? 'bg-teal-600 text-white'
                        : 'text-teal-200 hover:bg-teal-800/50 hover:text-white'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-teal-800/50" />

            {/* External links */}
            <div className="space-y-1">
              {externalLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    className="group flex items-center px-3 py-2 text-sm font-medium text-teal-200 rounded-lg hover:bg-teal-800/50 hover:text-white transition-colors"
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                    {item.href.startsWith('http') && (
                      <ExternalLink className="ml-auto h-4 w-4" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-teal-800/50">
            <div className="text-xs text-teal-300 text-center">
              MCP Dashboard v1.0
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;