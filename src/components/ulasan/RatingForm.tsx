import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { RATING } from '@/lib/ulasan-constants';

interface RatingFormProps {
  onSubmit: (rating: number, teks_ulasan: string) => Promise<void>;
  isLoading?: boolean;
}

export const RatingForm: React.FC<RatingFormProps> = ({ onSubmit, isLoading = false }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [teks_ulasan, setTeks_ulasan] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Silakan pilih rating');
      return;
    }

    if (teks_ulasan.trim().length < RATING.MIN_ULASAN_CHAR) {
      setError(`Ulasan harus minimal ${RATING.MIN_ULASAN_CHAR} karakter`);
      return;
    }

    try {
      await onSubmit(rating, teks_ulasan);
      setRating(0);
      setTeks_ulasan('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Rating</label>
        <div className="flex gap-2">
          {[RATING.MIN, 2, 3, 4, RATING.MAX].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <Star
                size={32}
                className={`transition-colors ${
                  star <= (hoverRating || rating)
                    ? 'fill-yellow-400 stroke-yellow-400'
                    : 'stroke-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <div className="mt-2 space-y-1">
            <p className="text-sm text-muted-foreground">
              Rating: <span className="font-semibold">{rating}/{RATING.MAX} bintang</span>
            </p>
            <p className="text-xs text-muted-foreground">
              ({RATING.LABELS[rating as keyof typeof RATING.LABELS]})
            </p>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="ulasan" className="mb-2 block text-sm font-medium">
          Ulasan Teks
        </label>
        <Textarea
          id="ulasan"
          value={teks_ulasan}
          onChange={(e) => setTeks_ulasan(e.target.value)}
          placeholder="Bagikan pengalaman Anda menggunakan gedung ini..."
          className="min-h-[120px]"
          maxLength={RATING.MAX_ULASAN_CHAR}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {teks_ulasan.length} / {RATING.MAX_ULASAN_CHAR} karakter
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Mengirim...' : 'Kirim Ulasan'}
      </Button>
    </form>
  );
};
