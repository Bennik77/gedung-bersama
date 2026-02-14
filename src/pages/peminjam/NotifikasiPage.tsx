import React from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, Info, AlertTriangle, XCircle, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

const iconMap = { info: Info, success: CheckCircle, warning: AlertTriangle, error: XCircle };
const colorMap = { info: 'text-info', success: 'text-success', warning: 'text-warning', error: 'text-destructive' };
const bgMap = { info: 'bg-info/10', success: 'bg-success/10', warning: 'bg-warning/10', error: 'bg-destructive/10' };

const NotifikasiPage: React.FC = () => {
  const { notifikasi, markAsRead, unreadCount } = useData();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-poppins text-2xl md:text-3xl font-bold">
            <span className="gradient-text">Notifikasi</span>
          </h1>
          <p className="text-muted-foreground mt-1">{unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua notifikasi sudah dibaca'}</p>
        </div>
      </motion.div>

      <div className="grid gap-3">
        {notifikasi.map((n, i) => {
          const Icon = iconMap[n.type];
          return (
            <motion.div key={n.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={`shadow-card transition-all ${!n.read ? 'border-l-4 border-l-primary' : 'opacity-75'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg ${bgMap[n.type]} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-5 w-5 ${colorMap[n.type]}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">{n.title}</h3>
                        <span className="text-xs text-muted-foreground">{format(new Date(n.created_at), 'd MMM yyyy', { locale: idLocale })}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                    </div>
                    {!n.read && (
                      <Button variant="ghost" size="sm" className="flex-shrink-0 gap-1" onClick={() => markAsRead(n.id)}>
                        <Check className="h-3 w-3" /> Tandai dibaca
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        {notifikasi.length === 0 && (
          <Card className="shadow-card"><CardContent className="py-12 text-center"><Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" /><p className="text-muted-foreground">Belum ada notifikasi</p></CardContent></Card>
        )}
      </div>
    </div>
  );
};

export default NotifikasiPage;
