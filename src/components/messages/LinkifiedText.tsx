import { Link } from 'react-router-dom';
import { splitLinks } from '@/lib/invitations';

// links in a message open in the app when they point at it, otherwise in a new tab
export function LinkifiedText({ text }: { text: string }) {
  return (
    <>
      {splitLinks(text, window.location.origin).map((part, i) => {
        if (!('href' in part)) return <span key={i}>{part.text}</span>;
        const classes = 'font-medium text-info underline break-all';
        return part.internalPath ? (
          <Link key={i} to={part.internalPath} className={classes}>{part.text}</Link>
        ) : (
          <a key={i} href={part.href} target="_blank" rel="noreferrer" className={classes}>{part.text}</a>
        );
      })}
    </>
  );
}
