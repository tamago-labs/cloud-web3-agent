"use client";

import React, { useContext, useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import ErrorBoundary from '../Shared/ErrorBoundary';
import { CloudAgentContext } from '@/hooks/useCloudAgent';
import { getCurrentUser } from 'aws-amplify/auth';


interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {

  const { loadProfile } = useContext(CloudAgentContext)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { userId } = await getCurrentUser();
        loadProfile(userId)
      } catch (e) {

      }
    })()
  }, [])

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen w-full">
      <DashboardHeader
        onMobileMenuToggle={handleMobileMenuToggle}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <DashboardSidebar
        isOpen={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default DashboardLayout;