import type { FormEvent } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/common/FormField';
import { PageHeader } from '@/components/common/PageHeader';
import { useSession } from '@/auth/session';
import { ACADEMIC_YEARS, UNIVERSITIES } from '@/config/options';

// saving will be wired to the users API during integration, form does not claim success until then
export default function StudentProfilePage() {
  const user = useSession((s) => s.user);
  const [first = '', ...rest] = (user?.name ?? '').split(' ');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Profile" description="Information mentors see when you book a session" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="flex items-center gap-4 p-6">
          <Avatar name={user?.name ?? '?'} src={user?.avatarUrl} size="xl" />
          <div>
            <p className="font-semibold text-ink">{user?.name}</p>
            <p className="text-sm text-ink-secondary">{user?.email}</p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Personal information" />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField htmlFor="firstName" label="First name" required>
                <Input id="firstName" defaultValue={first} autoComplete="given-name" required />
              </FormField>
              <FormField htmlFor="lastName" label="Last name" required>
                <Input id="lastName" defaultValue={rest.join(' ')} autoComplete="family-name" required />
              </FormField>
            </div>
            <FormField htmlFor="email" label="Email">
              <Input id="email" type="email" defaultValue={user?.email} disabled />
            </FormField>
            <FormField htmlFor="phone" label="Phone">
              <Input id="phone" type="tel" autoComplete="tel" placeholder="+94 77 000 0000" />
            </FormField>
            <FormField htmlFor="bio" label="About you">
              <Textarea id="bio" placeholder="Your interests and what you'd like help with" />
            </FormField>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Academic details" />
          <CardBody className="space-y-4">
            <FormField htmlFor="university" label="University">
              <Select id="university" placeholder="Select your university" options={UNIVERSITIES} />
            </FormField>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField htmlFor="degree" label="Degree">
                <Input id="degree" placeholder="e.g. BSc Computer Science" />
              </FormField>
              <FormField htmlFor="year" label="Academic year">
                <Select id="year" placeholder="Select year" options={ACADEMIC_YEARS} />
              </FormField>
            </div>
          </CardBody>
        </Card>

        <Button type="submit" size="lg">Save changes</Button>
      </form>
    </div>
  );
}
