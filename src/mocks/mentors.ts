import type { Mentor, ProfileExtras, Review, Slot } from '@/types';
import { MENTOR_EXTRAS, emptyExtras } from './profiles';

type MentorBase = Omit<Mentor, keyof ProfileExtras>;

const BASE_MENTORS: MentorBase[] = [
  {
    id: 'mentor-1', name: 'Nimal Silva', title: 'Senior Software Engineer', organization: 'WSO2',
    industry: 'Software Engineering', avatarUrl: null, experienceYears: 8, hourlyRate: 2500, rating: 4.8, reviewCount: 34,
    isVerified: true, skills: ['React', 'Node.js', 'TypeScript'],
    bio: 'Software engineer with 8+ years building scalable web applications. I help students plan their first engineering role and level up their frontend skills.',
  },
  {
    id: 'mentor-2', name: 'Priya Jayawardena', title: 'Product Manager', organization: 'IFS',
    industry: 'Product Management', avatarUrl: null, experienceYears: 6, hourlyRate: 3000, rating: 4.6, reviewCount: 21,
    isVerified: true, skills: ['Product strategy', 'Agile', 'UX'],
    bio: 'Product manager who moved from engineering into product. Happy to talk about PM career paths, interviews and roadmapping.',
  },
  {
    id: 'mentor-3', name: 'Roshan Fernando', title: 'Data Scientist', organization: 'Dialog Axiata',
    industry: 'Data Science & AI', avatarUrl: null, experienceYears: 10, hourlyRate: 3500, rating: 4.9, reviewCount: 45,
    isVerified: true, skills: ['Python', 'Machine learning', 'TensorFlow'],
    bio: 'Data scientist working on large-scale ML systems. I mentor students on data careers, portfolios and research projects.',
  },
  {
    id: 'mentor-4', name: 'Chamari Wickramasinghe', title: 'UX Designer', organization: 'Surge Global',
    industry: 'UX/UI Design', avatarUrl: null, experienceYears: 5, hourlyRate: 2000, rating: 4.7, reviewCount: 18,
    isVerified: true, skills: ['Figma', 'User research', 'Prototyping'],
    bio: 'UX designer focused on research-led product design. I review portfolios and help students break into design.',
  },
  {
    id: 'mentor-5', name: 'Amal Perera', title: 'DevOps Engineer', organization: 'Loadstone',
    industry: 'Cloud & DevOps', avatarUrl: null, experienceYears: 7, hourlyRate: 2800, rating: 4.5, reviewCount: 12,
    isVerified: true, skills: ['AWS', 'Docker', 'Kubernetes'],
    bio: 'DevOps engineer running cloud platforms. I help students understand infrastructure careers and certifications.',
  },
  {
    id: 'mentor-6', name: 'Kavindi Bandara', title: 'Marketing Manager', organization: 'John Keells Holdings',
    industry: 'Digital Marketing', avatarUrl: null, experienceYears: 4, hourlyRate: 1800, rating: 4.4, reviewCount: 9,
    isVerified: false, skills: ['Digital marketing', 'SEO', 'Brand strategy'],
    bio: 'Marketing manager in FMCG. I mentor on digital marketing, brand strategy and first marketing jobs.',
  },
];

export const MENTORS: Mentor[] = BASE_MENTORS.map((m) => ({ ...emptyExtras(), ...MENTOR_EXTRAS[m.id], ...m }));

export const findMentor = (id: string | undefined) => MENTORS.find((m) => m.id === id);

export const REVIEWS: Review[] = [
  { id: 'r1', author: 'Kavya G.', rating: 5, date: '15 Oct 2026', text: 'Very practical advice that I could apply in my internship straight away.' },
  { id: 'r2', author: 'Dilan R.', rating: 4, date: '10 Oct 2026', text: 'Knowledgeable and patient. Helped me plan the next steps in my career.' },
];

export const MENTOR_SLOTS: Slot[] = [
  { id: 's1', startsAt: '2026-11-03T10:00:00+05:30', endsAt: '2026-11-03T11:00:00+05:30', status: 'AVAILABLE' },
  { id: 's2', startsAt: '2026-11-03T11:00:00+05:30', endsAt: '2026-11-03T12:00:00+05:30', status: 'BOOKED' },
  { id: 's3', startsAt: '2026-11-03T14:00:00+05:30', endsAt: '2026-11-03T15:00:00+05:30', status: 'AVAILABLE' },
  { id: 's4', startsAt: '2026-11-04T16:00:00+05:30', endsAt: '2026-11-04T17:00:00+05:30', status: 'AVAILABLE' },
  { id: 's5', startsAt: '2026-11-05T10:00:00+05:30', endsAt: '2026-11-05T11:00:00+05:30', status: 'HELD' },
  { id: 's6', startsAt: '2026-11-05T15:00:00+05:30', endsAt: '2026-11-05T16:00:00+05:30', status: 'BLOCKED' },
];

// mentors the demo student has bookmarked
export const SAVED_MENTOR_IDS = ['mentor-3', 'mentor-4'];
