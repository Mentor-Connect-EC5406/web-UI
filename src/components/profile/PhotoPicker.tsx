import { useRef, useState, type ChangeEvent } from 'react';
import { Camera } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { MAX_PHOTO_BYTES, PHOTO_TYPES } from '@/config/constants';
import { photoError } from '@/lib/profile';

interface PhotoPickerProps {
  name: string;
  value: string | null;
  onChange: (value: string | null) => void;
}

// reads the image as a data url, the real API will upload the file instead
export function PhotoPicker({ name, value, onChange }: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // clear so choosing the same file again still fires a change
    e.target.value = '';
    if (!file) return;
    const problem = photoError(file);
    if (problem) {
      setError(problem);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setError(null);
      onChange(reader.result as string);
    };
    reader.onerror = () => setError('That image could not be read, try another one');
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <Avatar name={name} src={value} size="xl" />
      <div className="flex flex-wrap justify-center gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
          <Camera aria-hidden /> {value ? 'Change photo' : 'Upload photo'}
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
            Remove
          </Button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={PHOTO_TYPES.join(',')}
        className="sr-only"
        tabIndex={-1}
        aria-label="Profile photo"
        onChange={handleFile}
      />
      {error ? (
        <p role="alert" className="text-xs text-accent">{error}</p>
      ) : (
        <p className="text-xs text-ink-muted">JPG, PNG or WebP up to {MAX_PHOTO_BYTES / 1024 / 1024} MB</p>
      )}
    </div>
  );
}
