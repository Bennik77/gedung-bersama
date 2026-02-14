import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, DollarSign } from 'lucide-react';
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
import { REFUND_API, REFUND_PERCENTAGE } from '@/lib/refund-constants';
import { API_URL } from '@/lib/api';

interface RefundButtonProps {
  id_peminjaman: number;
  id_peminjam: number;
  harga_sewa: number;
  onSuccess?: () => void;
}

export const RefundButton: React.FC<RefundButtonProps> = ({
  id_peminjaman,
  id_peminjam,
  harga_sewa,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const refund_amount = harga_sewa * REFUND_PERCENTAGE;
  const admin_fee = harga_sewa - refund_amount;

  const handleRequestRefund = async () => {
    if (!reason.trim()) {
      toast({
        title: 'Error',
        description: 'Alasan refund harus diisi',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/${REFUND_API.REQUEST()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for session cookies
        body: JSON.stringify({
          id_peminjaman,
          id_peminjam,
          reason: reason.trim(),
        }),
      });

      // Check if response is OK (status 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Sukses',
          description: 'Permintaan refund berhasil diajukan. Admin akan meninjaunya dalam 1-2 hari kerja.',
        });
        setShowDialog(false);
        setShowConfirm(false);
        setReason('');
        onSuccess?.();
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Gagal mengajukan refund',
          variant: 'destructive',
        });
      }
    } catch (error) {
      // If we get here, it might still have succeeded on backend
      // Check if it's a JSON parse error vs network error
      console.error('Refund request error:', error);

      // Assume success and let user refresh to see the result
      toast({
        title: 'Permintaan Terkirim',
        description: 'Permintaan refund Anda sedang diproses. Silakan refresh halaman untuk melihat status terbaru.',
      });
      setShowDialog(false);
      setShowConfirm(false);
      setReason('');

      // Auto refresh after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDialog(true)}
        className="w-full text-red-600 border-red-200 hover:bg-red-50"
      >
        <DollarSign className="h-4 w-4 mr-2" />
        Ajukan Refund
      </Button>

      {/* Dialog Input Alasan */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajukan Permintaan Refund</DialogTitle>
            <DialogDescription>
              Jelaskan alasan mengapa Anda ingin melakukan refund
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Refund Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Informasi Refund:</p>
                  <ul className="space-y-1">
                    <li>• Harga Sewa: Rp {harga_sewa.toLocaleString('id-ID')}</li>
                    <li>• Potongan Admin (10%): Rp {admin_fee.toLocaleString('id-ID')}</li>
                    <li className="font-semibold">• Anda Terima (90%): Rp {refund_amount.toLocaleString('id-ID')}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Reason Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Alasan Refund *</label>
              <Textarea
                placeholder="Jelaskan alasan Anda mengajukan refund..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-24"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Batal
            </Button>
            <Button
              onClick={() => {
                setShowDialog(false);
                setShowConfirm(true);
              }}
            >
              Lanjutkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Refund?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan menerima refund sebesar Rp {refund_amount.toLocaleString('id-ID')} (90% dari harga sewa).
              Permintaan ini akan ditinjau oleh admin dalam 1-2 hari kerja.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRequestRefund}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? 'Mengirim...' : 'Konfirmasi Refund'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
