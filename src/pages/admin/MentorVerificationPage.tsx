import { useState } from 'react';
import { CheckCircle2, Eye, FileText, ShieldCheck, XCircle } from 'lucide-react';
import type { MentorApplication } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Textarea } from '@/components/ui/Input';
import { AsyncContent } from '@/components/common/AsyncContent';
import { EmptyState } from '@/components/common/EmptyState';
import { FormField } from '@/components/common/FormField';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { PersonRow } from '@/components/common/PersonRow';
import { useDecideApplication, useMentorApplications } from '@/data/admin';

// application details with approve and reject actions, rejection requires a reason
function ReviewDialog({ application, deciding, onClose, onDecide }: {
  application: MentorApplication;
  deciding: boolean;
  onClose: () => void;
  onDecide: (approve: boolean, reason?: string) => void;
}) {
  const [reason, setReason] = useState('');
  const details = [
    ['Email', application.email],
    ['Title', application.title],
    ['Organisation', application.organization],
    ['Industry', application.industry],
    ['Experience', `${application.experienceYears} years`],
    ['Submitted', application.submittedAt],
  ];

  return (
    <Dialog
      open
      onClose={onClose}
      title={`Review ${application.name}`}
      className="max-w-2xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={deciding}>Close</Button>
          <Button variant="danger" disabled={!reason.trim() || deciding} onClick={() => onDecide(false, reason.trim())}>
            <XCircle /> Reject
          </Button>
          <Button loading={deciding} onClick={() => onDecide(true)}>
            <CheckCircle2 /> Approve
          </Button>
        </>
      }
    >
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {details.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-ink-muted">{label}</dt>
            <dd className="mt-0.5 text-sm font-medium text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-6 mb-2 text-sm font-semibold text-ink">Documents</h3>
      <ul className="space-y-2">
        {application.documents.map((doc) => (
          <li key={doc.name} className="flex items-center gap-2 rounded-xl bg-surface-subtle p-3 text-sm">
            <FileText className="size-4 text-ink-muted" aria-hidden />
            <span className="font-medium text-ink">{doc.name}</span>
            <span className="text-ink-secondary">· {doc.type}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <FormField htmlFor="reject-reason" label="Reason for rejection (required to reject)">
          <Textarea id="reject-reason" value={reason} onChange={(e) => setReason(e.target.value)} />
        </FormField>
      </div>
    </Dialog>
  );
}

// queue of mentor applications awaiting review
export default function MentorVerificationPage() {
  // decisions will be sent to the admin API during integration
  const applications = useMentorApplications();
  const decide = useDecideApplication();
  const [reviewing, setReviewing] = useState<MentorApplication | null>(null);
  const count = applications.data?.length;

  function handleDecide(approve: boolean, reason?: string) {
    if (!reviewing) return;
    decide.mutate({ applicationId: reviewing.id, approve, reason }, { onSuccess: () => setReviewing(null) });
  }

  return (
    <div>
      <PageHeader
        title="Mentor verification"
        description={count !== undefined && `${count} ${count === 1 ? 'application' : 'applications'} waiting for review`}
      />

      <AsyncContent query={applications} loading={<ListSkeleton rows={2} />}>
        {(list) =>
          list.length === 0 ? (
            <EmptyState icon={ShieldCheck} title="All caught up" description="There are no applications waiting for review." />
          ) : (
            <div className="space-y-3">
              {list.map((a) => (
                <PersonRow
                  key={a.id}
                  className="bg-surface p-4"
                  name={a.name}
                  badges={<Badge tone="brand">Pending</Badge>}
                  detail={`${a.title} · ${a.organization} · ${a.experienceYears} years · Submitted ${a.submittedAt}`}
                  actions={<Button size="sm" variant="secondary" onClick={() => setReviewing(a)}><Eye /> Review</Button>}
                />
              ))}
            </div>
          )
        }
      </AsyncContent>

      {reviewing && (
        <ReviewDialog application={reviewing} deciding={decide.isPending} onClose={() => setReviewing(null)} onDecide={handleDecide} />
      )}
    </div>
  );
}
