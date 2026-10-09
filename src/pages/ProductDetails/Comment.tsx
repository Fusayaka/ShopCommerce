import { useEffect, useState } from 'react';
import './Comment.css';
import { StarRating } from '@/components';
import { useParams } from 'react-router-dom';
import { type Comment as CommentType } from '@/types';
import { commentApi } from '@/api/commentApi';

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

  const date = comment.updatedAt
    ? new Date(comment.updatedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'August 21, 2025';

  const displayName = comment.user?.name || 'Anonymous';
  const avatar = comment.user?.avatar;

  return (
    <div className="comment-card">
      <div className="comment-stars">
        <StarRating rating={comment.rating} />
      </div>

      <div className="comment-user-header">
        <div className="comment-avatar">
          {avatar ? (
            <img src={avatar} alt={displayName} />
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
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!productId) return;

    let active = true;

    const fetchComments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await commentApi.getProductComment(Number(productId));
        if (!active) return;
        setComments(data ?? [])
      } catch {
        if (!active) return;
        setError("Could not load comments.");
        setComments([]);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchComments();
    return () => { active = false; };

  }, [productId])

  if (isLoading) {
    return <div className="comment-status">Loading comments...</div>;
  }

  if (error) {
    return <div className="comment-status">{error}</div>;
  }

  if (comments.length === 0) {
    return <div className="comment-status">No comments yet.</div>;
  }

  return (
    <div className="comment-list">
      {comments.map(comment => (
        <CommentCard
          key={comment.id}
          comment={comment}
        />
      ))}
    </div>
  );
}