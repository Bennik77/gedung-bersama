import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { SidebarAdmin } from './SidebarAdmin';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { Button } from '@/components/ui/button'; // Keeping it just in case, but standard redirect doesn't need it.

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login-admin" replace />;
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      <ErrorBoundary>
        <SidebarAdmin collapsed={collapsed} onCollapse={setCollapsed} />
        <main className={cn(
          "flex-1 min-h-screen transition-all duration-300",
          "lg:ml-0"
        )}>
          <div className="p-4 lg:p-6 pt-16 lg:pt-6">
            <Outlet />
          </div>
        </main>
      </ErrorBoundary>
    </div>
  );
};
