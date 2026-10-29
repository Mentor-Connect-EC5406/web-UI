import { PageOutlet } from './PageOutlet';

// constrains public pages that are not full bleed to the standard max width
export function ContentLayout() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageOutlet />
    </div>
  );
}
