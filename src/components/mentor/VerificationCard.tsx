import { useRef, useState, type ChangeEvent } from 'react';
import { Clock, FileUp, ShieldAlert } from 'lucide-react';
import type { Verification } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { DOCUMENT_TYPES } from '@/config/constants';
import { documentError } from '@/lib/profile';

interface VerificationCardProps {
  // the newest document the mentor sent, undefined before the first one
  latest: Verification | undefined;
  uploading: boolean;
  error?: string;
  onUpload: (file: File) => void;
}

// students only find a mentor after an admin approves a document, so this stays until then
export function VerificationCard({ latest, uploading, error, onUpload }: VerificationCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const waiting = latest?.status === 'PENDING';
  const rejected = latest?.status === 'REJECTED';

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // clear so choosing the same file again still fires a change
    e.target.value = '';
    if (!file) return;
    const problem = documentError(file);
    setFileError(problem);
    if (!problem) onUpload(file);
  }

  return (
    <Card>
      <CardHeader
        title={waiting ? <><Clock className="size-4" aria-hidden /> Waiting for admin approval</> : <><ShieldAlert className="size-4" aria-hidden /> Get verified</>}
        action={<Badge tone={rejected ? 'accent' : 'brand'}>{rejected ? 'Not approved' : waiting ? 'In review' : 'Not verified'}</Badge>}
      />
      <CardBody className="space-y-3 text-sm text-ink-secondary">
        {waiting ? (
          <p>We received your document. Students can find and book you once an admin approves it.</p>
        ) : (
          <>
            {rejected && latest.reviewNote && (
              <p className="rounded-xl bg-accent-soft p-3 text-accent">Reason: {latest.reviewNote}</p>
            )}
            <p>
              Upload a document that shows your role, such as a work ID or an employment letter (PDF, JPG or PNG up to 10 MB).
              Students can find and book you once an admin approves it.
            </p>
            <Button size="sm" loading={uploading} onClick={() => inputRef.current?.click()}>
              <FileUp /> {rejected ? 'Upload a new document' : 'Upload document'}
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept={DOCUMENT_TYPES.join(',')}
              className="sr-only"
              tabIndex={-1}
              aria-label="Verification document"
              onChange={handleFile}
            />
          </>
        )}
        {(fileError || error) && <p role="alert" className="text-accent">{fileError ?? error}</p>}
      </CardBody>
    </Card>
  );
}
