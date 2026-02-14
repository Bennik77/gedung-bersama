// Refund API Endpoints
export const REFUND_API = {
  REQUEST: () => 'peminjaman/request_refund.php',
  APPROVE: () => 'peminjaman/approve_refund.php',
  LIST: (status: string = 'pending') => `peminjaman/list_refund.php?status=${status}`,
};

// Refund Status
export const REFUND_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const REFUND_STATUS_LABEL: Record<string, string> = {
  pending: 'Menunggu Persetujuan',
  approved: 'Disetujui',
  rejected: 'Ditolak',
};

export const REFUND_STATUS_COLOR: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

// Refund percentage (90% = 10% admin fee)
export const REFUND_PERCENTAGE = 0.9;
