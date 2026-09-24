import React from 'react';
import fullStar from '@/assets/fullstar.png';
import halfStar from '@/assets/halfstar.png';
import './starRating.css'

interface StarRatingProps {
  rating: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(
        <img key={i} src={fullStar} alt="star" className="star-icon" />
      );
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(
        <img key={i} src={halfStar} alt="half star" className="star-icon" />
      );
    } else {
      stars.push(
        <img key={i} src={fullStar} alt="empty star" className="star-icon empty-star" />
      );
    }
  }
  
  return <div className="star-rating-container">{stars}</div>;
};

export default StarRating;