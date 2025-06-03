"use client";

import React, { useContext, useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import ErrorBoundary from '../Shared/ErrorBoundary';
import { CloudAgentContext } from '@/hooks/useCloudAgent';
import { getCurrentUser } from 'aws-amplify/auth';
import { useInterval } from '@/hooks/useInterval';


interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {

  const [interval, setInterval] = useState(1000)

  const { profile, loadProfile } = useContext(CloudAgentContext)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useInterval(() => {

    if (!profile) {
      (async () => {
        const { userId } = await getCurrentUser();
        loadProfile(userId)
        setInterval(60000)
      })()
    }

  }, interval)

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