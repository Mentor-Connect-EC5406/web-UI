import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { MESSAGE_MAX_LENGTH } from '@/config/constants';

interface MessageComposerProps {
  // the composer shows progress and failure around this call
  onSend: (text: string) => Promise<unknown>;
  recipientName: string;
}

// text box that keeps the draft until the server accepts the message
export function MessageComposer({ onSend, recipientName }: MessageComposerProps) {
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'failed'>('idle');
  const sending = status === 'sending';
  const empty = !text.trim();

  async function send() {
    if (empty || sending) return;
    setStatus('sending');
    try {
      await onSend(text.trim());
      setText('');
      setStatus('idle');
    } catch {
      setStatus('failed');
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void send();
  }

  // enter sends and shift enter adds a new line like most chat apps
  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void send();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-line p-3">
      {status === 'failed' && (
        <p role="alert" className="mb-2 text-xs text-accent">Your message could not be sent. Please try again.</p>
      )}
      <div className="flex items-end gap-2">
        <label htmlFor="message-text" className="sr-only">Message {recipientName}</label>
        <Textarea
          id="message-text"
          rows={1}
          value={text}
          maxLength={MESSAGE_MAX_LENGTH}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${recipientName}`}
          readOnly={sending}
          className="max-h-32 min-h-10 resize-none"
        />
        <Button type="submit" disabled={empty} loading={sending} aria-label="Send message" className="shrink-0">
          {!sending && <Send />}
          <span className="hidden sm:inline">{sending ? 'Sending' : 'Send'}</span>
        </Button>
      </div>
    </form>
  );
}
