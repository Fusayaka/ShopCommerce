import { useState } from 'react';
import './Comment.css';

import { mockComments } from '@/mockdata/mockComment';
import fullStar from '@/assets/fullstar.png';
import halfStar from '@/assets/halfstar.png';
import { useParams } from 'react-router-dom';

export interface Comment {
  id: number;
  productId: string;
  name: string;
  content: string;
  rating: number;
  created_at?: Date | string;
  avatar?: string;
}

interface CommentCardProps {
  comment: Comment;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <>
      {Array.from({ length: 5 }, (_, index) => {
        const star = index + 1;

        if (star <= Math.floor(rating)) {
          return (
            <img
              key={star}
              src={fullStar}
              alt="star"
              className="star-icon"
            />
          );
        }

        if (star === Math.ceil(rating) && !Number.isInteger(rating)) {
          return (
            <img
              key={star}
              src={halfStar}
              alt="half star"
              className="star-icon"
            />
          );
        }

        return (
          <img
            key={star}
            src={fullStar}
            alt="empty star"
            className="star-icon empty-star"
          />
        );
      })}
    </>
  );
};

const CommentCard = ({ comment }: CommentCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const maxLength = 50;
  const isLongContent = comment.content.length > maxLength;

  const content =
    isLongContent && !isExpanded
      ? `${comment.content.slice(0, maxLength)}...`
      : comment.content;

  const date = comment.created_at
    ? new Date(comment.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'August 21, 2025';

  return (
    <div className="comment-card">
      <div className="comment-stars">
        <StarRating rating={comment.rating} />
      </div>

      <div className="comment-user-header">
        <div className="comment-avatar">
          {comment.avatar ? (
            <img src={comment.avatar} alt={comment.name} />
          ) : (
            comment.name.charAt(0).toUpperCase()
          )}
        </div>

        <h4 className="comment-username">{comment.name}</h4>
      </div>

      <p className="comment-content">{content}</p>

      {isLongContent && (
        <button
          type="button"
          className="comment-toggle-btn"
          onClick={() => setIsExpanded(prev => !prev)}
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}

      <span className="comment-date">{date}</span>
    </div>
  );
};

export default function Comment() {
  const { productId } = useParams<{ productId: string }>();

  const productComments = mockComments.filter(
    comment => comment.productId === productId
  );

  return (
    <div className="comment-list">
      {productComments.map(comment => (
        <CommentCard
          key={comment.id}
          comment={comment}
        />
      ))}
    </div>
  );
}