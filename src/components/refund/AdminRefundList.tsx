import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { REFUND_API, REFUND_STATUS_LABEL, REFUND_STATUS_COLOR } from '@/lib/refund-constants';
import { API_URL } from '@/lib/api';
import { CheckCircle, XCircle } from 'lucide-react';

interface RefundRequest {
  id_peminjaman: number;
  id_peminjam: number;
  nama_peminjam: string;
  peminjam_email: string;
  no_telepon: string;
  nama_gedung: string;
  harga_sewa: number;
  refund_amount: number;
  refund_status: string;
  refund_requested_at: string;
  refund_approved_at?: string;
  refund_notes?: string;
}

export const AdminRefundList: React.FC = () => {
  const { toast } = useToast();
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/${REFUND_API.LIST('all')}`);
      const result = await response.json();

      if (result.success) {
        setRefunds(result.data || []);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal memuat daftar refund',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveRefund = async () => {
    if (!selectedRefund) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/${REFUND_API.APPROVE()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_peminjaman: selectedRefund.id_peminjaman,
          action: 'approve',
          admin_notes: adminNotes.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Sukses',
          description: 'Refund berhasil disetujui',
        });
        setShowDialog(false);
        setAdminNotes('');
        setAction(null);
        setSelectedRefund(null);
        fetchRefunds();
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Gagal menyetujui refund',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectRefund = async () => {
    if (!selectedRefund) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/${REFUND_API.APPROVE()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_peminjaman: selectedRefund.id_peminjaman,
          action: 'reject',
          admin_notes: adminNotes.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Sukses',
          description: 'Refund berhasil ditolak',
        });
        setShowDialog(false);
        setAdminNotes('');
        setAction(null);
        setSelectedRefund(null);
        fetchRefunds();
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Gagal menolak refund',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-muted rounded" />
            <div className="h-20 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Permintaan Refund ({refunds.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {refunds.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Tidak ada permintaan refund
            </p>
          ) : (
            <div className="space-y-3">
              {refunds.map((refund) => (
                <div
                  key={refund.id_peminjaman}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Peminjam</p>
                      <p className="font-semibold">{refund.nama_peminjam}</p>
                      <p className="text-xs text-muted-foreground">{refund.peminjam_email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gedung</p>
                      <p className="font-semibold">{refund.nama_gedung}</p>
                      <p className="text-xs">Harga: Rp {refund.harga_sewa.toLocaleString('id-ID')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Refund</p>
                      <p className="font-semibold">Rp {refund.refund_amount.toLocaleString('id-ID')}</p>
                      <Badge className={REFUND_STATUS_COLOR[refund.refund_status]}>
                        {REFUND_STATUS_LABEL[refund.refund_status]}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground mb-3">
                    Diajukan: {new Date(refund.refund_requested_at).toLocaleString('id-ID')}
                  </div>

                  {refund.refund_status === 'pending' && (
                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600"
                        onClick={() => {
                          setSelectedRefund(refund);
                          setAction('approve');
                          setShowDialog(true);
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Setujui
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => {
                          setSelectedRefund(refund);
                          setAction('reject');
                          setShowDialog(true);
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Tolak
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog untuk approve/reject */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === 'approve' ? 'Setujui Refund' : 'Tolak Refund'}
            </DialogTitle>
            <DialogDescription>
              ID Peminjaman: {selectedRefund?.id_peminjaman}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p><strong>Peminjam:</strong> {selectedRefund?.nama_peminjam}</p>
              <p><strong>Gedung:</strong> {selectedRefund?.nama_gedung}</p>
              <p><strong>Jumlah Refund:</strong> Rp {selectedRefund?.refund_amount.toLocaleString('id-ID')}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Catatan {action === 'approve' ? '(Opsional)' : '(Alasan Penolakan)'}
              </label>
              <Textarea
                placeholder={
                  action === 'approve'
                    ? 'Catatan untuk peminjam...'
                    : 'Jelaskan alasan penolakan refund...'
                }
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="min-h-24"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Batal
            </Button>
            <Button
              onClick={action === 'approve' ? handleApproveRefund : handleRejectRefund}
              disabled={isSubmitting}
              className={action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {isSubmitting ? 'Memproses...' : action === 'approve' ? 'Setujui Refund' : 'Tolak Refund'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
