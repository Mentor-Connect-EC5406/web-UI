import { useState } from 'react';
import { CheckCircle2, Eye, Flag, XCircle } from 'lucide-react';
import type { Report, ReportDecision, ReportStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Dialog } from '@/components/ui/Dialog';
import { Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AsyncContent } from '@/components/common/AsyncContent';
import { EmptyState } from '@/components/common/EmptyState';
import { FormField } from '@/components/common/FormField';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { useDecideReport, useReports } from '@/data/admin';
import { formatDateTime } from '@/lib/format';
import { reportStatusMeta } from '@/lib/status';

const ALL = 'ALL';
const STATUS_FILTERS = [
  { value: ALL, label: 'All statuses' },
  ...(Object.keys(reportStatusMeta) as ReportStatus[]).map((s) => ({ value: s, label: reportStatusMeta[s].label })),
];

const isOpen = (r: Report) => r.status === 'OPEN' || r.status === 'UNDER_REVIEW';

function StatusBadge({ status }: { status: ReportStatus }) {
  return <Badge tone={reportStatusMeta[status].tone}>{reportStatusMeta[status].label}</Badge>;
}

// report details with resolve or dismiss, both need a note for the record
function ReviewReportDialog({ report, deciding, pendingOutcome, error, onClose, onDecide }: {
  report: Report;
  deciding: boolean;
  pendingOutcome?: ReportDecision['outcome'];
  error?: string | null;
  onClose: () => void;
  onDecide: (outcome: ReportDecision['outcome'], note: string) => void;
}) {
  const [note, setNote] = useState('');
  const [attempted, setAttempted] = useState(false);
  const noteError = attempted && !note.trim() ? 'Add a note explaining your decision.' : undefined;
  const open = isOpen(report);

  function decide(outcome: ReportDecision['outcome']) {
    setAttempted(true);
    if (note.trim()) onDecide(outcome, note.trim());
  }

  const details = [
    ['Reported by', report.reporter],
    ['Reported user', report.reportedUser],
    ['Submitted', formatDateTime(report.createdAt)],
  ];

  return (
    <Dialog
      open
      onClose={onClose}
      title={report.type}
      className="max-w-2xl"
      footer={
        open ? (
          <>
            <Button variant="secondary" onClick={onClose} disabled={deciding}>Close</Button>
            <Button variant="secondary" loading={pendingOutcome === 'DISMISSED'} disabled={deciding} onClick={() => decide('DISMISSED')}>
              <XCircle /> Dismiss
            </Button>
            <Button loading={pendingOutcome === 'RESOLVED'} disabled={deciding} onClick={() => decide('RESOLVED')}>
              <CheckCircle2 /> Resolve
            </Button>
          </>
        ) : (
          <Button variant="secondary" onClick={onClose}>Close</Button>
        )
      }
    >
      <div className="mb-4"><StatusBadge status={report.status} /></div>
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {details.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-ink-muted">{label}</dt>
            <dd className="mt-0.5 text-sm font-medium text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-6 mb-2 text-sm font-semibold text-ink">What was reported</h3>
      <p className="rounded-xl bg-surface-subtle p-3 text-sm text-ink">{report.details}</p>

      {open ? (
        <div className="mt-6">
          <FormField htmlFor="report-note" label="Decision note" required error={noteError} hint="Kept on record and shared with the reporter.">
            <Textarea
              id="report-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              aria-invalid={noteError ? true : undefined}
              aria-describedby={noteError ? 'report-note-error' : 'report-note-hint'}
              disabled={deciding}
            />
          </FormField>
          {error && <p role="alert" className="mt-3 text-sm text-accent">{error}</p>}
        </div>
      ) : (
        <>
          <h3 className="mt-6 mb-2 text-sm font-semibold text-ink">Decision note</h3>
          <p className="text-sm text-ink-secondary">{report.resolutionNote ?? 'No note was recorded.'}</p>
        </>
      )}
    </Dialog>
  );
}

// reports from users with a status filter and a review dialog
export default function ReportsPage() {
  const reports = useReports();
  const decide = useDecideReport();
  const [status, setStatus] = useState<ReportStatus | typeof ALL>(ALL);
  const [reviewing, setReviewing] = useState<Report | null>(null);
  const openCount = reports.data?.filter(isOpen).length;

  function handleDecide(outcome: ReportDecision['outcome'], note: string) {
    if (!reviewing) return;
    decide.mutate({ reportId: reviewing.id, outcome, note }, { onSuccess: () => setReviewing(null) });
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        description={openCount !== undefined ? `${openCount} ${openCount === 1 ? 'report needs' : 'reports need'} a decision` : 'Reports raised by students and mentors'}
        actions={
          <Select
            aria-label="Filter by status"
            placeholder="Status"
            options={STATUS_FILTERS}
            value={status}
            onValueChange={(v) => setStatus(v as ReportStatus | typeof ALL)}
            className="w-full sm:w-48"
          />
        }
      />

      <AsyncContent query={reports} loading={<ListSkeleton rows={3} />}>
        {(list) => {
          const shown = list.filter((r) => status === ALL || r.status === status);
          if (shown.length === 0) {
            return (
              <EmptyState
                icon={Flag}
                title={status === ALL ? 'No reports' : `No ${reportStatusMeta[status].label.toLowerCase()} reports`}
                description="Reports that users raise about each other appear here."
              />
            );
          }
          return (
            <ul className="space-y-3">
              {shown.map((r) => (
                <li key={r.id}>
                  <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-ink">{r.type}</p>
                        <StatusBadge status={r.status} />
                      </div>
                      <p className="mt-0.5 text-xs text-ink-secondary">
                        By {r.reporter} against {r.reportedUser} · {formatDateTime(r.createdAt)}
                      </p>
                    </div>
                    <Button size="sm" variant="secondary" className="self-start sm:self-auto" onClick={() => { decide.reset(); setReviewing(r); }}>
                      <Eye /> {isOpen(r) ? 'Review' : 'View'}
                    </Button>
                  </Card>
                </li>
              ))}
            </ul>
          );
        }}
      </AsyncContent>

      {reviewing && (
        <ReviewReportDialog
          report={reviewing}
          deciding={decide.isPending}
          pendingOutcome={decide.isPending ? decide.variables?.outcome : undefined}
          error={decide.error?.message}
          onClose={() => setReviewing(null)}
          onDecide={handleDecide}
        />
      )}
    </div>
  );
}
