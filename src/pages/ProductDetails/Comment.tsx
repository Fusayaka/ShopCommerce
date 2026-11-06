import { useEffect, useMemo, useState } from 'react';
import './comment.css';
import { StarRating, ConfirmModal } from '@/components';
import { useParams, useSearchParams } from 'react-router-dom';
import { type Comment as CommentType } from '@/types';
import { commentApi } from '@/api/commentApi';
import { toast } from 'react-toastify';
import { useAuth } from '@/utils/auth';

interface CommentCardProps {
  comment: CommentType;
  canManage?: boolean;
  isAdmin?: boolean;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onCancelEdit?: () => void;
  onSaveEdit?: (id: number, content: string, rating: number) => Promise<void>;
  onRequestDelete?: (id: number) => void;
}

const CommentCard = ({
  comment,
  canManage = false,
  isAdmin = false,
  isEditing = false,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onRequestDelete,
}: CommentCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [editRating, setEditRating] = useState(comment.rating);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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
    : null;

  const displayName = comment.user?.name || 'Anonymous';
  const avatar = comment.user?.avatar;

  const handleSave = async () => {
    const trimmed = editContent.trim();
    if (!trimmed) {
      toast.error('Content cannot be empty.');
      return;
    }
    setIsUpdating(true);
    try {
      await onSaveEdit?.(comment.id, trimmed, editRating);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditContent(comment.content);
    setEditRating(comment.rating);
    onCancelEdit?.();
  };

return (
    <div className="comment-card">
      <div className="comment-user-header">
        <div className="comment-avatar">
          {avatar ? (
            <img src={avatar} alt={displayName} />
          ) : (
            displayName.charAt(0).toUpperCase()
          )}
        </div>

        <h4 className="comment-username">{displayName}</h4>

        {canManage && !isEditing && (
          <div className="comment-menu-container">
            <button
              type="button"
              className="comment-menu-trigger"
              onClick={() => setShowMenu(prev => !prev)}
              aria-label="More options"
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </button>

            {showMenu && (
              <>
                <div
                  className="comment-menu-backdrop"
                  onClick={() => setShowMenu(false)}
                />

                <div className="comment-dropdown">
                  {!isAdmin && (<button
                    type="button"
                    className="comment-dropdown-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onStartEdit?.();
                    }}
                  >
                    Edit
                  </button>
                  )}

                  <button
                    type="button"
                    className="comment-dropdown-item comment-dropdown-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onRequestDelete?.(comment.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="comment-sub-header">
          <div className="comment-stars">
            <StarRating rating={comment.rating} />
          </div>
          {date && <span className="comment-date">{date}</span>}
        </div>
      )}

      {isEditing ? (
        <div className="comment-edit-form">
          <div className="comment-form-rating">
            <span className="comment-form-label">Your rating</span>
            <div className="comment-form-stars">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  className={`comment-form-star ${n <= editRating ? 'active' : ''}`}
                  onClick={() => setEditRating(n)}
                  aria-label={`${n} star${n > 1 ? 's' : ''}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <textarea
            className="comment-form-input"
            rows={3}
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
          />

          <div className="comment-edit-actions">
            <button
              type="button"
              className="comment-edit-cancel-btn"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              Cancel
            </button>

            <button
              type="button"
              className="comment-form-submit"
              onClick={handleSave}
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default function Comment() {
  const { productId } = useParams<{ productId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { loggedIn, user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [newRating, setNewRating] = useState(5);
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [canReview, setCanReview] = useState(false);

  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
        setComments(data ?? []);
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
  }, [productId]);

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
  }, [productId, loggedIn]);

  const handleConfirmDelete = async () => {
    if (!deletingCommentId) return;

    setIsDeleting(true);
    const previous = comments;
    setComments(prev => prev.filter(c => c.id !== deletingCommentId));

    try {
      await commentApi.deleteComment(deletingCommentId);
      toast.success("Review deleted.");
      setCanReview(true);
      setDeletingCommentId(null);
    } catch {
      setComments(previous);
      toast.error("Could not delete your review. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveEdit = async (commentId: number, updatedContent: string, updatedRating: number) => {
    try {
      const updated = await commentApi.updateComment(commentId, {
        content: updatedContent,
        rating: updatedRating,
      });

      setComments(prev =>
        prev.map(c => (c.id === commentId ? { ...c, ...updated } : c))
      );
      toast.success("Review updated.");
      setEditingCommentId(null);
    } catch {
      toast.error("Could not update your review. Please try again.");
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
      setCanReview(false);
    } catch {
      setSubmitError("Could not post your review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="comment-section">
      <h2 className="comment-section-title">Reviews</h2>

      {loggedIn && canReview && (
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
            placeholder="Share your thoughts about this product..."
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
                canManage={loggedIn && (comment.user?.id === user?.id || isAdmin)}
                isAdmin={isAdmin}
                isEditing={editingCommentId === comment.id}
                onStartEdit={() => setEditingCommentId(comment.id)}
                onCancelEdit={() => setEditingCommentId(null)}
                onSaveEdit={handleSaveEdit}
                onRequestDelete={(id) => setDeletingCommentId(id)}
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

      <ConfirmModal
        isOpen={deletingCommentId !== null}
        isLoading={isDeleting}
        title="Delete Review"
        content="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onClose={() => setDeletingCommentId(null)}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}