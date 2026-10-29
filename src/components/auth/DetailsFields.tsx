import { Info } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/common/FormField';
import { ACADEMIC_YEARS, INDUSTRIES, UNIVERSITIES } from '@/config/options';

// extra details collected from students after sign up
export function StudentDetailsFields() {
  return (
    <>
      <FormField htmlFor="university" label="University">
        <Select id="university" placeholder="Select your university" options={UNIVERSITIES} />
      </FormField>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField htmlFor="faculty" label="Faculty or degree" required>
          <Input id="faculty" name="faculty" placeholder="e.g. Computer Science" required />
        </FormField>
        <FormField htmlFor="year" label="Academic year">
          <Select id="year" placeholder="Select year" options={ACADEMIC_YEARS} />
        </FormField>
      </div>
    </>
  );
}

// extra details collected from mentors after sign up
export function MentorDetailsFields() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField htmlFor="jobTitle" label="Job title" required>
          <Input id="jobTitle" name="jobTitle" autoComplete="organization-title" required />
        </FormField>
        <FormField htmlFor="organization" label="Organisation" required>
          <Input id="organization" name="organization" autoComplete="organization" required />
        </FormField>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField htmlFor="field" label="Job field">
          <Select id="field" placeholder="Select your field" options={INDUSTRIES} />
        </FormField>
        <FormField htmlFor="experience" label="Years of experience" required>
          <Input id="experience" name="experience" type="number" min={1} max={50} required />
        </FormField>
      </div>
      <p className="flex items-start gap-2 rounded-xl bg-brand-soft p-3 text-sm text-ink-secondary">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        Our team reviews every mentor profile before it appears to students. You can start setting up straight away.
      </p>
    </>
  );
}
