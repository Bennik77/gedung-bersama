import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  LayoutDashboard, 
  Building, 
  FileText, 
  Users,
  UserCog,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { cn } from '@/lib/utils';

const adminMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Building, label: 'Kelola Gedung', href: '/admin/gedung' },
  { icon: FileText, label: 'Kelola Peminjaman', href: '/admin/peminjaman' },
  { icon: Users, label: 'Kelola Peminjam', href: '/admin/peminjam' },
  { icon: UserCog, label: 'Kelola Petugas', href: '/admin/petugas' },
  { icon: BarChart3, label: 'Pembayaran', href: '/admin/pembayaran' },
  { icon: BarChart3, label: 'Laporan', href: '/admin/laporan' },
];

interface SidebarAdminProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export const SidebarAdmin: React.FC<SidebarAdminProps> = ({ 
  collapsed = false, 
  onCollapse 
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { pendingPeminjaman } = useData();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={cn(
        "p-4 border-b border-sidebar-border",
        collapsed && !isMobile && "px-2"
      )}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-primary shadow-primary flex-shrink-0">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          {(!collapsed || isMobile) && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-poppins font-bold text-lg gradient-text"
            >
              PinjamGedungku
            </motion.span>
          )}
        </div>
      </div>

      {/* Admin Badge & User Info */}
      {(!collapsed || isMobile) && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 border-b border-sidebar-border"
        >
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-primary" />
            <Badge variant="secondary" className="text-xs">
              {user?.jabatan || 'Administrator'}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">
                {user?.nama.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.nama}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {adminMenuItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/admin'}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
              collapsed && !isMobile && "justify-center px-2",
              isActive 
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <div className="relative">
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.href === '/admin/peminjaman' && pendingPeminjaman.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-warning text-warning-foreground">
                  {pendingPeminjaman.length}
                </Badge>
              )}
            </div>
            {(!collapsed || isMobile) && (
              <span className="text-sm">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
            collapsed && !isMobile && "justify-center px-2"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {(!collapsed || isMobile) && <span>Keluar</span>}
        </Button>
      </div>

      {/* Collapse Button (Desktop Only) */}
      {!isMobile && onCollapse && (
        <div className="p-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => onCollapse(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border h-screen sticky top-0 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon" className="shadow-md">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarContent isMobile />
        </SheetContent>
      </Sheet>
    </>
  );
};
