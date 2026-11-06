export type MentorshipFrequency = 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';

// REQUESTED until the mentor answers, the student may withdraw it until then
export type MentorshipStatus = 'REQUESTED' | 'ACTIVE' | 'DECLINED' | 'WITHDRAWN' | 'COMPLETED' | 'CANCELLED';

// 0 is Sunday, matching Date.getDay
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// when the recurring sessions happen, times are wall clock in the given timezone
export interface MentorshipSchedule {
  frequency: MentorshipFrequency;
  // used by weekly and fortnightly schedules
  weekday: Weekday;
  // used by monthly schedules, 1 to 28 so every month has it
  dayOfMonth: number;
  // HH:mm
  time: string;
  // yyyy-mm-dd
  startDate: string;
  timezone: string;
}

export interface Mentorship {
  id: string;
  mentorId: string;
  mentorName: string;
  studentId: string;
  studentName: string;
  title: string;
  goals: string;
  durationMonths: number;
  status: MentorshipStatus;
  // the student's preference while REQUESTED, the agreed schedule once ACTIVE
  schedule: MentorshipSchedule;
  declineReason: string | null;
  createdAt: string;
}

export interface MentorshipRequestInput {
  mentorId: string;
  title: string;
  goals: string;
  durationMonths: number;
  schedule: MentorshipSchedule;
}
