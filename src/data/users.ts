import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { StudentProfileUpdate } from '@/types';
import { db, mutate, respond } from './mockServer';
import { keys } from './keys';

// replace each function body with a real API call of the same signature
export const usersApi = {
  studentProfile: () => respond(() => db.studentProfile),
  updateStudentProfile: (update: StudentProfileUpdate) =>
    mutate(() => { db.studentProfile = { ...db.studentProfile, ...structuredClone(update) }; }),
};

export const useStudentProfile = () => useQuery({ queryKey: keys.studentProfile, queryFn: usersApi.studentProfile });

export function useUpdateStudentProfile() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: usersApi.updateStudentProfile,
    onSuccess: () => client.invalidateQueries({ queryKey: keys.studentProfile }),
  });
}
