import { useState } from 'react';
import type { Session } from '@/types';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Textarea } from '@/components/ui/Input';
import { FormField } from '@/components/common/FormField';
import { StarRatingInput } from '@/components/common/StarRatingInput';
import { REVIEW_MAX_LENGTH, REVIEW_MIN_LENGTH } from '@/config/constants';
import { formatDate } from '@/lib/format';
import { validateReview, type ReviewErrors } from '@/lib/sessions';

interface ReviewDialogProps {
  session: Session;
  saving: boolean;
  // set when the last save failed
  saveError?: string | null;
  onClose: () => void;
  onSubmit: (review: { rating: number; text: string }) => void;
}

// star rating and written feedback for a completed session
export function ReviewDialog({ session, saving, saveError, onClose, onSubmit }: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  // errors appear after the first attempt then follow the input
  const [attempted, setAttempted] = useState(false);
  const shown: ReviewErrors = attempted ? validateReview(rating, text) : {};
  const length = text.trim().length;

  function submit() {
    const found = validateReview(rating, text);
    setAttempted(true);
    if (!found.rating && !found.text) onSubmit({ rating, text: text.trim() });
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title={`Review your session with ${session.mentorName}`}
      description={`${session.topic} · ${formatDate(session.startsAt)}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button loading={saving} onClick={submit}>Submit review</Button>
        </>
      }
    >
      <div className="space-y-5">
        <StarRatingInput id="review-rating" label="Your rating" value={rating} onChange={setRating} error={shown.rating} disabled={saving} />
        <FormField
          htmlFor="review-text"
          label="Your review"
          required
          error={shown.text}
          hint={`At least ${REVIEW_MIN_LENGTH} characters · ${length} written`}
        >
          <Textarea
            id="review-text"
            value={text}
            maxLength={REVIEW_MAX_LENGTH}
            onChange={(e) => setText(e.target.value)}
            placeholder="What was helpful? What could the mentor do differently?"
            aria-invalid={shown.text ? true : undefined}
            aria-describedby={shown.text ? 'review-text-error' : 'review-text-hint'}
            disabled={saving}
          />
        </FormField>
        {saveError && <p role="alert" className="text-sm text-accent">{saveError}</p>}
      </div>
    </Dialog>
  );
}
