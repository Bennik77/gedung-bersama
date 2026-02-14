import { Star } from 'lucide-react';

interface RatingDisplayProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  size = 'md',
  showText = true,
}) => {
  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const starSize = sizeMap[size];
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="relative">
            <Star
              size={starSize}
              className="stroke-gray-300"
              fill="currentColor"
            />
            {star <= filledStars && (
              <div className="absolute inset-0 flex">
                <Star
                  size={starSize}
                  className="stroke-yellow-400"
                  fill="currentColor"
                  color="currentColor"
                  style={{ color: '#FBBF24' }}
                />
              </div>
            )}
            {star === Math.ceil(rating) && hasHalfStar && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: '50%' }}
              >
                <Star
                  size={starSize}
                  className="stroke-yellow-400"
                  fill="currentColor"
                  style={{ color: '#FBBF24' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      {showText && (
        <span className="ml-1 text-sm font-medium text-gray-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
