import { Star } from 'lucide-react';

interface RatingStatsProps {
  average_rating: number | string;
  total_ulasan: number;
  rating_5: number;
  rating_4: number;
  rating_3: number;
  rating_2: number;
  rating_1: number;
}

export const RatingStats: React.FC<RatingStatsProps> = ({
  average_rating,
  total_ulasan,
  rating_5,
  rating_4,
  rating_3,
  rating_2,
  rating_1,
}) => {
  // Convert average_rating to number if it's a string
  const avgRating = typeof average_rating === 'string' 
    ? parseFloat(average_rating) || 0 
    : average_rating || 0;

  const getRatingPercentage = (count: number) => {
    return total_ulasan === 0 ? 0 : (count / total_ulasan) * 100;
  };

  const ratings = [
    { stars: 5, count: rating_5 },
    { stars: 4, count: rating_4 },
    { stars: 3, count: rating_3 },
    { stars: 2, count: rating_2 },
    { stars: 1, count: rating_1 },
  ];

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-6 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={24}
                className={
                  i < Math.round(avgRating)
                    ? 'fill-yellow-400 stroke-yellow-400'
                    : 'stroke-gray-300'
                }
              />
            ))}
          </div>
        </div>
        <p className="text-3xl font-bold">{avgRating.toFixed(1)}</p>
        <p className="text-sm text-muted-foreground">
          Berdasarkan {total_ulasan} ulasan
        </p>
      </div>

      <div className="space-y-3">
        {ratings.map(({ stars, count }) => (
          <div key={stars} className="flex items-center gap-2">
            <span className="w-8 text-sm font-medium">{stars} ★</span>
            <div className="flex-1 rounded-full bg-gray-200 h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all"
                style={{ width: `${getRatingPercentage(count)}%` }}
              />
            </div>
            <span className="w-12 text-right text-sm text-muted-foreground">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
