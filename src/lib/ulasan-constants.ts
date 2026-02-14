// API endpoints untuk ulasan/rating
export const ULASAN_API = {
  BASE: 'http://localhost/pinjamgedungku-api/api/ulasan',
  LIST: () => `${ULASAN_API.BASE}/list.php`,
  CREATE: () => `${ULASAN_API.BASE}/create.php`,
  UPDATE: () => `${ULASAN_API.BASE}/update.php`,
  DELETE: (id_ulasan: number) => `${ULASAN_API.BASE}/delete.php?id_ulasan=${id_ulasan}`,
  RATING_AVERAGE: (id_gedung: number) => `${ULASAN_API.BASE}/rating_average.php?id_gedung=${id_gedung}`,
};

// Rating constants
export const RATING = {
  MIN: 1,
  MAX: 5,
  LABELS: {
    1: 'Buruk',
    2: 'Kurang Baik',
    3: 'Biasa Saja',
    4: 'Bagus',
    5: 'Sangat Bagus',
  },
  MIN_ULASAN_CHAR: 10,
  MAX_ULASAN_CHAR: 500,
};

// Status peminjaman yang allow rating
export const PEMINJAMAN_STATUS_FOR_RATING = 'disetujui';
