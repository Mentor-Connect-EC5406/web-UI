import { useState } from 'react';
import { Link2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CopyLinkButtonProps {
  url: string;
  label?: string;
  className?: string;
}

export function CopyLinkButton({ url, label = 'Copy profile link', className }: CopyLinkButtonProps) {
  const [result, setResult] = useState<'copied' | 'failed' | null>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setResult('copied');
    } catch {
      // clipboard access can be blocked, so show the link for manual copying
      setResult('failed');
    }
  }

  return (
    <div className={className}>
      <Button type="button" variant="secondary" size="sm" className="w-full" onClick={copy}>
        <Link2 aria-hidden /> {label}
      </Button>
      <p role="status" className="mt-1 text-xs break-all text-ink-secondary">
        {result === 'copied' && 'Link copied'}
        {result === 'failed' && `Copy this link: ${url}`}
      </p>
    </div>
  );
}
