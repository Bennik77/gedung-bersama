interface UlasanListProps {
  ulasans: Array<{
    id_ulasan: number;
    id_peminjam: number;
    id_gedung: number;
    rating: number;
    teks_ulasan: string;
    created_at: string;
    nama_peminjam: string;
    nama_gedung?: string;
  }>;
}

import { Star, MessageCircle } from 'lucide-react';

export const UlasanList: React.FC<UlasanListProps> = ({ ulasans }) => {
  if (!ulasans || ulasans.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <MessageCircle className="mx-auto mb-2 text-muted-foreground" size={32} />
        <p className="text-muted-foreground">Belum ada ulasan untuk gedung ini</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      {ulasans.map((ulasan) => (
        <div
          key={ulasan.id_ulasan}
          className="rounded-lg border p-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm">{ulasan.nama_peminjam}</p>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < ulasan.rating
                          ? 'fill-yellow-400 stroke-yellow-400'
                          : 'stroke-gray-300'
                      }
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-yellow-600 ml-1">
                  {ulasan.rating}/5
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(ulasan.created_at)}
              </p>
            </div>
          </div>

          <p className="mt-2 text-sm text-gray-700 leading-relaxed">{ulasan.teks_ulasan}</p>
        </div>
      ))}
    </div>
  );
};
