
import { Student, Task, Document, SubjectProgress, SessionReport } from './types';

export const MOCK_STUDENT: Student = {
  name: "Léa",
  avatar: "https://picsum.photos/seed/lea/200/200",
  grade: "6ème B",
  overallProgress: 68,
};

export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: "Mathématiques : Exercices p.42",
    category: "Devoirs",
    color: "bg-blue-100",
    dueDate: "Demain",
    isCompleted: false,
  },
  {
    id: '2',
    title: "Lire 'Le Petit Prince' chap. 1-3",
    category: "Français",
    color: "bg-purple-100",
    dueDate: "Vendredi",
    isCompleted: false,
  },
  {
    id: '3',
    title: "Dessin : Apporter des feutres",
    category: "Arts",
    color: "bg-yellow-100",
    dueDate: "Lundi",
    isCompleted: true,
  },
  {
    id: '4',
    title: "Réviser les verbes irréguliers",
    category: "Anglais",
    color: "bg-green-100",
    dueDate: "Mardi",
    isCompleted: false,
  }
];

export const MOCK_DOCUMENTS: Document[] = [
  { id: 'd1', name: "Cours_SVT_Photosynthese.pdf", type: 'pdf', date: "Hier", size: "1.2 MB" },
  { id: 'd2', name: "Exercices_Fractions.doc", type: 'doc', date: "12 Oct", size: "450 KB" },
  { id: 'd3', name: "Schema_Geographie.png", type: 'image', date: "10 Oct", size: "2.5 MB" },
];

export const MOCK_SUBJECTS: SubjectProgress[] = [
  { subject: "Maths", progress: 75, color: "bg-blue-400" },
  { subject: "Français", progress: 82, color: "bg-purple-400" },
  { subject: "Histoire", progress: 45, color: "bg-orange-400" },
  { subject: "SVT", progress: 60, color: "bg-green-400" },
];

export const MOCK_REPORTS: SessionReport[] = [
  {
    id: 'r1',
    date: '18 Octobre 2023',
    subject: 'Mathématiques',
    summary: 'Révision des fractions et introduction aux pourcentages.',
    fullFeedback: "Léa a très bien compris le concept de simplification des fractions. Elle a encore quelques hésitations sur la mise au même dénominateur mais les exercices d'application ont été réussis. Nous avons commencé à voir le lien avec les pourcentages, ce qui semble l'intéresser beaucoup.",
    nextGoals: ['Maîtriser le passage de fraction à pourcentage', 'Exercices p.54 sans aide'],
    isNew: true
  },
  {
    id: 'r2',
    date: '15 Octobre 2023',
    subject: 'Français',
    summary: 'Analyse de texte sur "Le Petit Prince".',
    fullFeedback: "Une séance très riche en échanges. Léa exprime ses idées avec clarté. Nous avons travaillé sur l'implicite dans le chapitre 2. Elle doit continuer à structurer ses réponses écrites avec des connecteurs logiques.",
    nextGoals: ['Utiliser "cependant" et "par conséquent"', 'Rédiger le résumé du chapitre 3'],
    isNew: false
  },
  {
    id: 'r3',
    date: '11 Octobre 2023',
    subject: 'SVT',
    summary: 'La photosynthèse et le cycle de l\'eau.',
    fullFeedback: "Séance d'observation et de dessin technique. Léa est très méticuleuse. Le schéma de la cellule végétale est parfait. Prochaine étape : apprendre le vocabulaire spécifique par cœur.",
    nextGoals: ['Apprendre les 10 mots clés', 'Préparer le mini-exposé'],
    isNew: false
  }
];
