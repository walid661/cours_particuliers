
export interface Student {
  name: string;
  avatar: string;
  grade: string;
  overallProgress: number;
}

export interface Task {
  id: string;
  title: string;
  category: string;
  color: string;
  dueDate: string;
  isCompleted: boolean;
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image';
  date: string;
  size: string;
  url?: string;
}

export interface SubjectProgress {
  subject: string;
  progress: number;
  color: string;
}

export interface SessionReport {
  id: string;
  date: string;
  subject: string;
  summary: string;
  fullFeedback: string;
  nextGoals: string[];
  isNew?: boolean;
}
