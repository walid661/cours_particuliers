
import { Student, Task, Document, SubjectProgress, SessionReport } from './types';

export const MOCK_STUDENT: Student = {
  id: 'student-1',
  name: "Léa",
  avatar_url: "https://picsum.photos/seed/lea/200/200",
  grade: "6ème B",
  role: 'student'
};

export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    student_id: 'student-1',
    title: "Mathématiques : Exercices p.42",
    category: "Devoirs",
    color: "bg-blue-100",
    due_date: "Demain",
    is_completed: false,
  },
  {
    id: '2',
    student_id: 'student-1',
    title: "Lire 'Le Petit Prince' chap. 1-3",
    category: "Français",
    color: "bg-purple-100",
    due_date: "Vendredi",
    is_completed: false,
  },
  {
    id: '3',
    student_id: 'student-1',
    title: "Dessin : Apporter des feutres",
    category: "Arts",
    color: "bg-yellow-100",
    due_date: "Lundi",
    is_completed: true,
  },
  {
    id: '4',
    student_id: 'student-1',
    title: "Réviser les verbes irréguliers",
    category: "Anglais",
    color: "bg-green-100",
    due_date: "Mardi",
    is_completed: false,
  }
];

export const MOCK_DOCUMENTS: Document[] = [
  { id: 'd1', student_id: 'student-1', name: "Cours_SVT_Photosynthese.pdf", type: 'pdf', created_at: "Hier", size: "1.2 MB", file_url: "https://pdfobject.com/pdf/sample.pdf" },
  { id: 'd2', student_id: 'student-1', name: "Exercices_Fractions.doc", type: 'doc', created_at: "12 Oct", size: "450 KB", file_url: "" },
  { id: 'd3', student_id: 'student-1', name: "Schema_Geographie.png", type: 'image', created_at: "10 Oct", size: "2.5 MB", file_url: "" },
];

export const MOCK_SUBJECTS: SubjectProgress[] = [
  { id: 's1', student_id: 'student-1', name: "Maths", progress: 75, color: "bg-blue-400" },
  { id: 's2', student_id: 'student-1', name: "Français", progress: 82, color: "bg-purple-400" },
  { id: 's3', student_id: 'student-1', name: "Histoire", progress: 45, color: "bg-orange-400" },
  { id: 's4', student_id: 'student-1', name: "SVT", progress: 60, color: "bg-green-400" },
];

export const MOCK_REPORTS: SessionReport[] = [
  {
    id: 'r1',
    student_id: 'student-1',
    created_at: '18 Octobre 2023',
    subject: 'Mathématiques',
    summary: 'Révision des fractions et introduction aux pourcentages.',
    full_feedback: "Léa a très bien compris le concept de simplification des fractions. Elle a encore quelques hésitations sur la mise au même dénominateur mais les exercices d'application ont été réussis. Nous avons commencé à voir le lien avec les pourcentages, ce qui semble l'intéresser beaucoup.",
    next_goals: ['Maîtriser le passage de fraction à pourcentage', 'Exercices p.54 sans aide'],
    is_new: true
  },
  {
    id: 'r2',
    student_id: 'student-1',
    created_at: '15 Octobre 2023',
    subject: 'Français',
    summary: 'Analyse de texte sur "Le Petit Prince".',
    full_feedback: "Une séance très riche en échanges. Léa exprime ses idées avec clarté. Nous avons travaillé sur l'implicite dans le chapitre 2. Elle doit continuer à structurer ses réponses écrites avec des connecteurs logiques.",
    next_goals: ['Utiliser "cependant" et "par conséquent"', 'Rédiger le résumé du chapitre 3'],
    is_new: false
  },
  {
    id: 'r3',
    student_id: 'student-1',
    created_at: '11 Octobre 2023',
    subject: 'SVT',
    summary: 'La photosynthèse et le cycle de l\'eau.',
    full_feedback: "Séance d'observation et de dessin technique. Léa est très méticuleuse. Le schéma de la cellule végétale est parfait. Prochaine étape : apprendre le vocabulaire spécifique par cœur.",
    next_goals: ['Apprendre les 10 mots clés', 'Préparer le mini-exposé'],
    is_new: false
  }
];
