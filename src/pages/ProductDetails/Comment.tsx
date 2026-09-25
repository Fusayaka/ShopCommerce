import { useState } from 'react';
import './Comment.css';

import { mockComments } from '@/mockdata';
import StarRating from '@/components/StarRating/StarRating';
import { useParams } from 'react-router-dom';
import { type Comment as CommentType } from '@/types';

interface CommentCardProps {
  comment: CommentType;
}

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

  const displayName = comment.name || 'Anonymous';

  return (
    <div className="comment-card">
      <div className="comment-stars">
        <StarRating rating={comment.rating} />
      </div>

      <div className="comment-user-header">
        <div className="comment-avatar">
          {comment.avatar ? (
            <img src={comment.avatar} alt={displayName} />
          ) : (
            displayName.charAt(0).toUpperCase()
          )}
        </div>

        <h4 className="comment-username">{displayName}</h4>
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