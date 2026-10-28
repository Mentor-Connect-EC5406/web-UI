import type { ConversationRecord, Participant } from '@/types';

const ASHAN: Participant = { id: 'student-1', name: 'Ashan Perera', role: 'STUDENT', avatarUrl: null };
const NIMAL: Participant = { id: 'mentor-1', name: 'Nimal Silva', role: 'MENTOR', avatarUrl: null };
const PRIYA: Participant = { id: 'mentor-2', name: 'Priya Jayawardena', role: 'MENTOR', avatarUrl: null };
const ROSHAN: Participant = { id: 'mentor-3', name: 'Roshan Fernando', role: 'MENTOR', avatarUrl: null };
const KAVYA: Participant = { id: 'student-2', name: 'Kavya Gunawardena', role: 'STUDENT', avatarUrl: null };
const DILAN: Participant = { id: 'student-3', name: 'Dilan Rathnayake', role: 'STUDENT', avatarUrl: null };
const THARUSHI: Participant = { id: 'student-4', name: 'Tharushi Senanayake', role: 'STUDENT', avatarUrl: null };

// everyone a new conversation can be started with
export const MESSAGE_CONTACTS = [ASHAN, NIMAL, PRIYA, ROSHAN, KAVYA, DILAN, THARUSHI];

export const CONVERSATIONS: ConversationRecord[] = [
  {
    id: 'c1',
    participants: [ASHAN, NIMAL],
    messages: [
      { id: 'c1-1', senderId: 'student-1', text: 'Hi Nimal, thanks for accepting my session request!', sentAt: '2026-10-25T09:12:00+05:30' },
      { id: 'c1-2', senderId: 'mentor-1', text: 'Happy to help. Could you share the repo you want me to look at before Monday?', sentAt: '2026-10-25T10:03:00+05:30' },
      { id: 'c1-3', senderId: 'student-1', text: 'Sure, I will send the link tonight.', sentAt: '2026-10-25T10:20:00+05:30' },
      { id: 'c1-4', senderId: 'mentor-1', text: 'Great. Also note down two or three questions about state management so we can focus on them.', sentAt: '2026-10-27T18:45:00+05:30' },
    ],
    lastReadAt: { 'student-1': '2026-10-25T10:20:00+05:30', 'mentor-1': '2026-10-27T18:45:00+05:30' },
  },
  {
    id: 'c2',
    participants: [ASHAN, PRIYA],
    messages: [
      { id: 'c2-1', senderId: 'mentor-2', text: 'It was great talking about product careers. Here is the reading list I mentioned.', sentAt: '2026-10-15T13:00:00+05:30' },
      { id: 'c2-2', senderId: 'student-1', text: 'Thank you Priya, this is really helpful.', sentAt: '2026-10-15T14:10:00+05:30' },
    ],
    lastReadAt: { 'student-1': '2026-10-15T14:10:00+05:30', 'mentor-2': '2026-10-15T14:10:00+05:30' },
  },
  {
    id: 'c3',
    participants: [ASHAN, ROSHAN],
    messages: [
      { id: 'c3-1', senderId: 'student-1', text: 'Hello Roshan, I booked a session about my ML project.', sentAt: '2026-10-26T08:30:00+05:30' },
      { id: 'c3-2', senderId: 'mentor-3', text: 'Thanks Ashan. What dataset are you using?', sentAt: '2026-10-27T09:15:00+05:30' },
      { id: 'c3-3', senderId: 'mentor-3', text: 'If you can, share a short summary of your results so far.', sentAt: '2026-10-27T09:16:00+05:30' },
    ],
    lastReadAt: { 'student-1': '2026-10-26T08:30:00+05:30', 'mentor-3': '2026-10-27T09:16:00+05:30' },
  },
  {
    id: 'c4',
    participants: [KAVYA, NIMAL],
    messages: [
      { id: 'c4-1', senderId: 'student-2', text: 'Hi, could we cover system design basics in our next session?', sentAt: '2026-10-27T20:05:00+05:30' },
    ],
    lastReadAt: { 'student-2': '2026-10-27T20:05:00+05:30' },
  },
  {
    id: 'c5',
    participants: [DILAN, NIMAL],
    messages: [
      { id: 'c5-1', senderId: 'mentor-1', text: 'Sorry we had to cancel. Book another slot whenever suits you.', sentAt: '2026-10-22T09:00:00+05:30' },
      { id: 'c5-2', senderId: 'student-3', text: 'No problem, I booked the 3rd of November.', sentAt: '2026-10-22T12:40:00+05:30' },
    ],
    lastReadAt: { 'student-3': '2026-10-22T12:40:00+05:30', 'mentor-1': '2026-10-22T12:40:00+05:30' },
  },
];
