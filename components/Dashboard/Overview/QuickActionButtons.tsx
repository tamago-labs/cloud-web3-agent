import React from 'react';
import Link from 'next/link';
import { MessageSquare, Settings, Book, ExternalLink, Play } from 'lucide-react';

interface QuickActionButtonsProps {
  className?: string;
}

const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({ className = "" }) => {
  const actions = [
    {
      title: 'Open Playground',
      description: 'Test your MCP tools with our built-in chat interface',
      href: '/dashboard/playground',
      icon: MessageSquare,
      color: 'from-blue-500 to-blue-600',
      external: false
    },
    {
      title: 'Configure Tools',
      description: 'Select and customize which MCP tools to enable',
      href: '/dashboard/tools',
      icon: Settings,
      color: 'from-purple-500 to-purple-600',
      external: false
    },
    {
      title: 'View Documentation',
      description: 'Learn how to integrate MCP with your applications',
      href: 'https://docs.tamagolabs.com',
      icon: Book,
      color: 'from-green-500 to-green-600',
      external: true
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          
          const content = (
            <div className="bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-xl p-6 hover:border-teal-500/50 hover:scale-[1.02] transition-all duration-300 group cursor-pointer">
              <div className="flex items-start space-x-4">
                <div className={`p-3 bg-gradient-to-r ${action.color} rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-teal-200 transition-colors">
                      {action.title}
                    </h3>
                    {action.external && (
                      <ExternalLink className="w-4 h-4 text-teal-400" />
                    )}
                  </div>
                  
                  <p className="text-sm text-teal-200 leading-relaxed">
                    {action.description}
                  </p>
                  
                  <div className="mt-3 flex items-center text-sm text-teal-400 group-hover:text-teal-300 transition-colors">
                    <Play className="w-3 h-3 mr-1" />
                    <span>Get started</span>
                  </div>
                </div>
              </div>
            </div>
          );

          if (action.external) {
            return (
              <a
                key={action.title}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content}
              </a>
            );
          }

          return (
            <Link key={action.title} href={action.href}>
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionButtons;