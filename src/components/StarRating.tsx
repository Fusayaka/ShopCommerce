import React from 'react';
import fullStar from '@/assets/fullstar.svg';
import halfStar from '@/assets/halfstar.svg';

interface StarRatingProps {
  rating: number;
}

const STAR_ICON = 'h-4 w-4 object-contain';

export const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(
        <img key={i} src={fullStar} alt="star" className={STAR_ICON} />
      );
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(
        <img key={i} src={halfStar} alt="half star" className={STAR_ICON} />
      );
    } else {
      stars.push(
        <img key={i} src={fullStar} alt="empty star" className={`${STAR_ICON} [filter:opacity(30%)_grayscale(70%)]`} />
      );
    }
  }

  return <div className="inline-flex gap-0.5">{stars}</div>;
};

export default StarRating;