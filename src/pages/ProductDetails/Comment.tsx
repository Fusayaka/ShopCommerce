import { useEffect, useMemo, useState } from 'react';
import { StarRating, ConfirmModal, DropDownSelector, SubmitButton, Avatar } from '@/components';
import { useParams, useSearchParams } from 'react-router-dom';
import { type Comment as CommentType } from '@/types';
import { commentApi } from '@/api/commentApi';
import { toast } from 'react-toastify';
import { useAuth } from '@/utils/auth';

const FORM_RATING_ROW = "ml-[15px] flex items-center gap-2.5";
const FORM_LABEL = "text-[15px] font-semibold text-black";
const FORM_INPUT = "box-border h-[150px] w-full resize-y rounded-xl border border-[#e0e0e0] px-4 py-3 text-[15px] text-black focus:border-black focus:outline-none max-md:h-[100px]";
const FORM_SUBMIT = "cursor-pointer self-end rounded-full border-none bg-black px-6 py-2.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50";

const StarInput = ({ value, onChange }: { value: number; onChange: (n: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(n => (
      <button
        key={n}
        type="button"
        className={`cursor-pointer border-none bg-none p-0 text-2xl leading-none transition-colors ${n <= value ? 'text-[#ffc107]' : 'text-[#d9d9d9]'}`}
        onClick={() => onChange(n)}
        aria-label={`${n} star${n > 1 ? 's' : ''}`}
      >
        ★
      </button>
    ))}
  </div>
);

interface CommentCardProps {
  comment: CommentType;
  isOwner?: boolean;
  isAdmin?: boolean;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onCancelEdit?: () => void;
  onSaveEdit?: (id: number, content: string, rating: number) => Promise<void>;
  onRequestDelete?: (id: number) => void;
}

const CommentCard = ({
  comment,
  isOwner = false,
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

  const dropdownItem = "w-full cursor-pointer rounded-md border-none bg-none px-2 py-[3px] text-left text-[13px] font-medium transition-colors";

return (
    <div className="mb-5 flex flex-col gap-[5px] rounded-[20px] border-2 border-[#f0f0f0] bg-white px-6 pt-[15px] pb-2.5 text-left shadow-[0_2px_8px_rgba(0,0,0,0.02)] max-md:rounded-2xl max-md:px-[18px] max-md:py-3">
      <div className="flex items-center gap-3 border-b border-[#f0f0f0] pb-4">
        <Avatar
          src={avatar}
          name={displayName}
          className="h-11 w-11 shrink-0 overflow-hidden rounded-full max-md:h-10 max-md:w-10"
          fallbackClassName="bg-[#f2f0f1] text-[#666]"
        />

        <h4 className="m-0 text-lg font-bold text-black max-md:text-base">{displayName}</h4>

        {(isOwner || isAdmin) && !isEditing && (
          <div className="relative ml-auto">
            <button
              type="button"
              className="cursor-pointer rounded-md border-none bg-none px-2 py-1 text-lg leading-none font-bold text-[#6b7280] transition-colors hover:bg-[#f3f4f6] hover:text-[#111827]"
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
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />

                <div className="absolute top-full right-0 z-20 mt-1 flex w-auto flex-col rounded-lg border border-[#e5e7eb] bg-white p-1 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                  {(!isAdmin || isOwner) && (<button
                    type="button"
                    className={`${dropdownItem} text-[#374151] hover:bg-[#f3f4f6]`}
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
                    className={`${dropdownItem} text-[#dc2626] hover:bg-[#fef2f2]`}
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
        <div className="mt-1 mb-2 flex items-center justify-start gap-3">
          <div className="flex items-center gap-1">
            <StarRating rating={comment.rating} />
          </div>
          {date && <span className="translate-y-[1px] text-xs leading-none text-[#666]">{date}</span>}
        </div>
      )}

      {isEditing ? (
        <div className="mt-3 flex flex-col gap-3">
          <div className={FORM_RATING_ROW}>
            <span className={FORM_LABEL}>Your rating</span>
            <StarInput value={editRating} onChange={setEditRating} />
          </div>

          <textarea
            className={FORM_INPUT}
            rows={3}
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
          />

          <div className="flex items-center justify-end gap-2.5">
            <button
              type="button"
              className="cursor-pointer rounded-full border border-[#d1d5db] bg-transparent px-4 py-2 text-[15px] font-medium text-[#374151] transition-all enabled:hover:shadow-[0_0_8px_rgba(0,0,0,0.06)]"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              Cancel
            </button>

            <SubmitButton
              type="button"
              className={FORM_SUBMIT}
              onClick={handleSave}
              loading={isUpdating}
              loadingText="Saving..."
            >
              Save
            </SubmitButton>
          </div>
        </div>
      ) : (
        <>
          <p className="m-0 pt-0.5 text-[15px] leading-normal text-black max-md:text-sm">{content}</p>

          {isLongContent && (
            <button
              type="button"
              className="w-fit cursor-pointer border-none bg-none p-0 text-sm font-semibold text-[#007bff] hover:underline"
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
    let active = true;

    const checkEligibility = async () => {
      if (!productId || !loggedIn) {
        if (active) setCanReview(false);
        return;
      }
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

  const statusCls = "px-[15px]";

  return (
    <section className="px-[5%] pt-2.5 pb-5 text-left max-md:px-[30px]">
      <h2 className="m-0 mb-2.5 pb-4 text-center text-[36px] font-bold text-black">Reviews</h2>

      {loggedIn && canReview && (
        <form className="mb-3 flex flex-col gap-2.5 rounded-[20px] border-2 border-[#f0f0f0] bg-white px-6 pt-[15px] pb-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          <div className={FORM_RATING_ROW}>
            <span className={FORM_LABEL}>Your rating</span>
            <StarInput value={newRating} onChange={setNewRating} />
          </div>

          <textarea
            className={FORM_INPUT}
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

          {submitError && <p className="m-0 text-sm text-[#ff3333]">{submitError}</p>}

          <SubmitButton
            className={FORM_SUBMIT}
            loading={isSubmitting}
            loadingText="Posting..."
          >
            Post
          </SubmitButton>
        </form>
      )}

      {sortedComments.length > 0 && (
        <div className="mb-5 flex items-center justify-end gap-2 [&_label]:text-sm [&_label]:font-medium [&_label]:text-[#666]">
          <label htmlFor="comment-sort-select">Sort by</label>
          <DropDownSelector
            variant="pill"
            id="comment-sort-select"
            value={sort}
            onChange={handleSortChange}
            aria-label="Sort by"
            options={[
              { value: 'date', label: 'Newest' },
              { value: 'rating', label: 'Rating' },
            ]}
          />
        </div>
      )}

      <div>
        {isLoading ? (
          <div className={statusCls}>Loading comments...</div>
        ) : error ? (
          <div className={statusCls}>{error}</div>
        ) : sortedComments.length === 0 ? (
          <div className={statusCls}>No comments yet.</div>
        ) : (
          <>
            {visibleComments.map(comment => (
              <CommentCard
                key={comment.id}
                comment={comment}
                isOwner={loggedIn && comment.user?.id === user?.id}
                isAdmin={loggedIn && isAdmin}
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
                className="mx-auto mt-1 block w-fit cursor-pointer self-center rounded-full border-2 border-black bg-none px-7 py-2.5 text-[15px] font-semibold text-black transition-colors hover:bg-black hover:text-white"
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