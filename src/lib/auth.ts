import { store } from './store';
import { User, Role } from './types';

export function authenticate(email: string): User | undefined {
  return store.getUserByEmail(email);
}

export function getCurrentUserFromHeader(authHeader?: string): User | undefined {
  if (!authHeader) return undefined;
  const token = authHeader.replace('Bearer ', '').trim();
  // For demo, token is userId
  return store.getUserById(token);
}

export const DEMO_ACCOUNTS: { role: Role; label: string; email: string; name: string; title: string }[] = [
  {
    role: 'HOD',
    label: 'HOD (Admin)',
    email: 'hod.cs@exitq.edu',
    name: 'Dr. Ananya Sharma',
    title: 'Head of Department, CS',
  },
  {
    role: 'FACULTY',
    label: 'Faculty',
    email: 'rajesh.kumar@exitq.edu',
    name: 'Prof. Rajesh Kumar',
    title: 'Associate Professor, CS',
  },
  {
    role: 'GUARD',
    label: 'Security Guard',
    email: 'guard.gate1@exitq.edu',
    name: 'Ramesh Singh',
    title: 'Senior Officer, Gate 1',
  },
  {
    role: 'STUDENT',
    label: 'Student',
    email: 'aarav.mehta@student.exitq.edu',
    name: 'Aarav Mehta',
    title: 'CS 4th Sem (CS-2023-042)',
  },
];
