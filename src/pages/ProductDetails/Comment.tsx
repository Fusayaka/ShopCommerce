import { useEffect, useMemo, useState } from 'react';
import './Comment.css';
import { StarRating } from '@/components';
import { useParams, useSearchParams } from 'react-router-dom';
import { type Comment as CommentType } from '@/types';
import { commentApi } from '@/api/commentApi';
import { toast } from 'react-toastify';
import { useAuth } from '@/utils/auth';

interface CommentCardProps {
  comment: CommentType;
  canDelete?: boolean;
  onDelete?: (id: number) => void;
}

const CommentCard = ({ comment, canDelete = false, onDelete }: CommentCardProps) => {
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

        {canDelete && (
          <button
            type="button"
            className="comment-delete-btn"
            onClick={() => onDelete?.(comment.id)}
            aria-label="Delete your review"
          >
            Delete
          </button>
        )}
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

  const { loggedIn, user } = useAuth();

  const [newRating, setNewRating] = useState(5);
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [canReview, setCanReview] = useState(false);

  const REVIEW_STEP = 2;
  const [visibleCount, setVisibleCount] = useState(REVIEW_STEP);

  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sort') === 'rating' ? 'rating' : 'date';

  const sortedComments = useMemo(() => {
    const list = [...comments];
    if (sort === 'rating') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    return list.sort((a, b) => {
      const da = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const db = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return db - da;
    });
  }, [comments, sort]);
  const visibleComments = sortedComments.slice(0, visibleCount);
  const hasMore = visibleCount < sortedComments.length;

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

  useEffect(() => {
    if (!productId || !loggedIn) {
      setCanReview(false);
      return;
    }

    let active = true;

    const checkEligibility = async () => {
      try {
        const eligibility = await commentApi.checkReviewEligibility(Number(productId));
        if (!active) return;
        setCanReview(eligibility.canReview);
      } catch {
        if (!active) return;
        setCanReview(false);
      }
    };

    checkEligibility();
    return () => { active = false; };

  }, [productId, loggedIn])

  const handleDelete = async (commentId: number) => {
    if (!window.confirm("Delete this review?")) return;

    const previous = comments;
    setComments(prev => prev.filter(c => c.id !== commentId));

    try {
      await commentApi.deleteComment(commentId);
      toast.success("Review deleted.");
    } catch {
      setComments(previous);
      toast.error("Could not delete your review. Please try again.");
    }
  };

  const handleSortChange = (value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set('sort', value);
      params.delete('page');
      setSearchParams(params);
      setVisibleCount(REVIEW_STEP);
  };

  const handleSubmit = async () => {
    if (!productId) return;
    if (!user) {
      setSubmitError("Please log in to write a review.");
      return;
    }

    const content = newContent.trim();
    if (!content) {
      setSubmitError("Please write something before submitting.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const eligibility = await commentApi.checkReviewEligibility(Number(productId));
      if (!eligibility.canReview) {
        setSubmitError(eligibility.reason || "You can only review products you have purchased.");
        return;
      }

      const created = await commentApi.createComment({
        productId: Number(productId),
        content,
        rating: newRating,
      });
      setComments(prev => [created, ...prev]);
      setNewContent('');
      setNewRating(5);
    } catch {
      setSubmitError("Could not post your review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="comment-section">
      <h2 className="comment-section-title">Reviews</h2>

      {!loggedIn && canReview && (
        <form className="comment-form" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          <div className="comment-form-rating">
            <span className="comment-form-label">Your rating</span>
            <div className="comment-form-stars">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  className={`comment-form-star ${n <= newRating ? 'active' : ''}`}
                  onClick={() => setNewRating(n)}
                  aria-label={`${n} star${n > 1 ? 's' : ''}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <textarea
            className="comment-form-input"
            placeholder="Share your thoughts about this product... (Enter to post, Shift+Enter for a new line)"
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!isSubmitting) handleSubmit();
              }
            }}
            rows={3}
          />

          {submitError && <p className="comment-form-error">{submitError}</p>}

          <button
            type="submit"
            className="comment-form-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </form>
      )}
      {sortedComments.length > 0 && (
        <div className="comment-sort">
          <label htmlFor="comment-sort-select">Sort by</label>
          <select
            id="comment-sort-select"
            value={sort}
            onChange={e => handleSortChange(e.target.value)}
          >
            <option value="date">Newest</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      )}

      <div className="comment-list">
        {isLoading ? (
          <div className="comment-status">Loading comments...</div>
        ) : error ? (
          <div className="comment-status">{error}</div>
        ) : sortedComments.length === 0 ? (
          <div className="comment-status">No comments yet.</div>
        ) : (
          <>
            {visibleComments.map(comment => (
              <CommentCard
                key={comment.id}
                comment={comment}
                canDelete={loggedIn && comment.user?.id === user.id}
                onDelete={handleDelete}
              />
            ))}

            {hasMore && (
              <button
                type="button"
                className="comment-view-more-btn"
                onClick={() => setVisibleCount(prev => prev + REVIEW_STEP)}
              >
                View more reviews
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}