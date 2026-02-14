import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'menunggu' | 'disetujui' | 'ditolak' | 'dibatalkan';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const styles = {
    menunggu: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
    disetujui: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
    ditolak: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
    dibatalkan: 'bg-muted/50 text-muted-foreground border-muted/20 hover:bg-muted/60',
  };

  const labels = {
    menunggu: 'Menunggu',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
    dibatalkan: 'Dibatalkan',
  };

  return (
    <Badge
      variant="outline"
      className={cn(styles[status], 'font-medium', className)}
    >
      {labels[status]}
    </Badge>
  );
};
