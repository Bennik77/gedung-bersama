import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'destructive';
  className?: string;
}

const variantStyles = {
  default: 'bg-card',
  primary: 'bg-gradient-primary text-primary-foreground',
  secondary: 'bg-gradient-secondary text-secondary-foreground',
  success: 'bg-success/10 border-success/20',
  warning: 'bg-warning/10 border-warning/20',
  destructive: 'bg-destructive/10 border-destructive/20',
};

const iconStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-white/20 text-primary-foreground',
  secondary: 'bg-white/20 text-secondary-foreground',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
  destructive: 'bg-destructive/20 text-destructive',
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        'shadow-card hover:shadow-card-hover transition-all duration-300',
        variantStyles[variant],
        className
      )}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className={cn(
                'text-sm font-medium',
                variant === 'default' ? 'text-muted-foreground' : 'opacity-80'
              )}>
                {title}
              </p>
              <p className="text-3xl font-poppins font-bold">
                {value}
              </p>
              {trend && (
                <p className={cn(
                  'text-xs flex items-center gap-1',
                  trend.isPositive ? 'text-success' : 'text-destructive'
                )}>
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                  <span className="text-muted-foreground ml-1">vs bulan lalu</span>
                </p>
              )}
            </div>
            <div className={cn(
              'p-3 rounded-xl',
              iconStyles[variant]
            )}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
