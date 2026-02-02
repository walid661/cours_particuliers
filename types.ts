export interface Student {
  id: string;
  name: string;
  avatar_url?: string; // Changed from avatar
  grade: string;
  role: 'student' | 'admin';
}

export interface Task {
  id: string;
  student_id: string;
  title: string;
  category: string;
  color: string;
  due_date: string; // Changed from dueDate
  is_completed: boolean; // Changed from isCompleted
}

export interface Document {
  id: string;
  student_id?: string;
  name: string;
  type: 'pdf' | 'doc' | 'image'; // You might want to match DB text type
  created_at: string; // Used for date
  size: string;
  file_url: string; // Changed from url
}

export interface SubjectProgress {
  id: string;
  student_id: string;
  name: string; // Changed from subject
  progress: number;
  color: string;
}

export interface SessionReport {
  id: string;
  student_id: string;
  created_at: string; // Used for date
  subject: string;
  summary: string;
  full_feedback: string; // Changed from fullFeedback
  next_goals: string[]; // Changed from nextGoals
  is_new?: boolean; // Changed from isNew
}
