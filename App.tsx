import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Search,
  ArrowLeft,
  Plus,
  FilePlus,
  Upload,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { Session } from '@supabase/supabase-js';
import Sidebar from './components/Sidebar';
import WelcomeCard from './components/WelcomeCard';
import ProgressCard from './components/ProgressCard';
import TaskBoard from './components/TaskBoard';
import DocumentList from './components/DocumentList';
import SessionReportList from './components/SessionReportList';
import SessionReportDetail from './components/SessionReportDetail';
import Login from './components/Login';
import StudentList from './components/StudentList';
import ProfileForm from './components/ProfileForm';
import CreateTaskModal from './components/CreateTaskModal';
import CreateReportModal from './components/CreateReportModal';

import { MOCK_STUDENT } from './constants';
import { Document, SessionReport } from './types';
import { supabase } from './lib/supabase';

type View = 'dashboard' | 'courses' | 'documents' | 'doc-detail' | 'reports' | 'report-detail' | 'profile' | 'onboarding';

const ADMIN_EMAIL = 'w.elghouti@gmail.com'; // Change si besoin

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewingStudentId, setViewingStudentId] = useState<string | null>(null);

  // Data States
  const [student, setStudent] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  // UI States
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [selectedReport, setSelectedReport] = useState<SessionReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modals States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- AUTH & INITIALIZATION ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkUserRole(session?.user.id, session?.user.email);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      checkUserRole(session?.user.id, session?.user.email);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRole = async (userId?: string, email?: string) => {
    if (!userId) { setIsAdmin(false); return; }

    if (email === ADMIN_EMAIL) {
      setIsAdmin(true);
      return;
    }

    const { data, error } = await supabase.from('profiles').select('role').eq('id', userId).single();

    if (error || !data) {
      // Si pas de profil, on redirige vers l'onboarding au lieu de logout
      setIsAdmin(false);
      setViewingStudentId(userId);
      setCurrentView('onboarding');
      return;
    }

    if (data?.role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      setViewingStudentId(userId);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
    setViewingStudentId(null);
    setStudent(null);
  };

  // --- DATA FETCHING ---
  const fetchData = async () => {
    if (!session || !viewingStudentId) return;
    setIsLoading(true);

    try {
      // 1. Profile
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', viewingStudentId).single();
      if (profileData) setStudent(profileData);
      else if (!isAdmin) setCurrentView('onboarding');

      // 2. Subjects
      const { data: subData } = await supabase.from('subjects').select('*').eq('student_id', viewingStudentId);
      if (subData) setSubjects(subData);

      // 3. Tasks
      const { data: taskData } = await supabase.from('tasks').select('*').eq('student_id', viewingStudentId).order('created_at', { ascending: false });
      if (taskData) setTasks(taskData);

      // 4. Documents
      const { data: docData } = await supabase.from('documents').select('*').eq('student_id', viewingStudentId).order('created_at', { ascending: false });
      if (docData) {
        setDocuments(docData.map((d: any) => ({
          ...d,
          created_at: new Date(d.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
        })));
      }

      // 5. Reports
      const { data: repData } = await supabase.from('sessions_reports').select('*').eq('student_id', viewingStudentId).order('created_at', { ascending: false });
      if (repData) {
        setReports(repData.map((r: any) => ({
          ...r,
          created_at: new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
        })));
      }

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session, viewingStudentId, isAdmin]);


  // --- ACTIONS ---
  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    if (isAdmin) return; // Prof ne coche pas les devoirs
    await supabase.from('tasks').update({ is_completed: !currentStatus }).eq('id', taskId);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, is_completed: !currentStatus } : t));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !viewingStudentId) return;

    try {
      const fileName = `${Date.now()}.${file.name.split('.').pop()}`;
      const { data, error } = await supabase.storage.from('documents').upload(fileName, file);
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(fileName);

      await supabase.from('documents').insert({
        student_id: viewingStudentId,
        name: file.name,
        type: file.type.includes('pdf') ? 'pdf' : 'doc',
        size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
        file_url: publicUrl
      });

      fetchData(); // Refresh
      alert("Document ajouté !");
    } catch (err) {
      console.error(err);
      alert("Erreur upload");
    }
  };

  const handleProfileUpdate = () => {
    fetchData();
    if (currentView === 'onboarding') setCurrentView('dashboard');
  };

  // --- RENDERERS ---
  const renderContent = () => {
    // VUE ADMIN SPÉCIALE
    if (isAdmin && currentView === 'dashboard') {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* HEADER FICHE ÉLÈVE */}
          <div className="bg-white p-8 rounded-[32px] paper-border mb-8 flex justify-between items-center shadow-sm">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-1">Dossier : {student?.name || 'Sans Nom'}</h2>
              <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">Classe : {student?.grade || 'Non définie'}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-indigo-50 text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-100 transition-colors flex items-center gap-2"
              >
                <Upload size={20} /> Ajouter Document
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} hidden />

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="bg-indigo-50 text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-100 transition-colors flex items-center gap-2"
              >
                <FilePlus size={20} /> Compte Rendu
              </button>

              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200"
              >
                <Plus size={20} /> Nouveau Devoir
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* VUE RAPIDE DEVOIRS */}
            <div className="bg-white p-6 rounded-[24px] paper-border">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">Devoirs en cours</h3>
              <div className="space-y-3">
                {tasks.slice(0, 3).map(t => (
                  <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between">
                    <span className="font-medium text-slate-700">{t.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${t.is_completed ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {t.is_completed ? 'Fait' : 'À faire'}
                    </span>
                  </div>
                ))}
                {tasks.length === 0 && <p className="text-slate-400 italic text-sm">Aucun devoir.</p>}
              </div>
            </div>

            {/* VUE RAPIDE RAPPORTS */}
            <div className="bg-white p-6 rounded-[24px] paper-border">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">Derniers Rapports</h3>
              <div className="space-y-3">
                {reports.slice(0, 3).map(r => (
                  <div key={r.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="font-bold text-slate-800 text-sm">{r.summary}</div>
                    <div className="text-xs text-slate-500">{r.created_at}</div>
                  </div>
                ))}
                {reports.length === 0 && <p className="text-slate-400 italic text-sm">Aucun rapport.</p>}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // VUE ÉLÈVE CLASSIQUE
    switch (currentView) {
      case 'dashboard':
        const overallProgress = subjects.length > 0
          ? Math.round(subjects.reduce((acc, curr) => acc + (curr.progress || 0), 0) / subjects.length)
          : 0;
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="xl:col-span-2 space-y-8">
              <WelcomeCard student={student || MOCK_STUDENT} overallProgress={overallProgress} onRevise={() => setCurrentView('courses')} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-[24px] paper-border">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><BookOpen className="text-blue-400" size={24} /> Mes Progrès</h3>
                  <div className="space-y-6">
                    {subjects.map((sub, idx) => <ProgressCard key={idx} subject={sub.name} progress={sub.progress} color={sub.color} />)}
                  </div>
                </div>
                <DocumentList documents={documents} onDocClick={(doc) => { setSelectedDoc(doc); setCurrentView('doc-detail'); }} onAddDocument={() => { }} isAdmin={false} />
              </div>
            </div>
            <div className="space-y-8">
              <TaskBoard tasks={tasks} />
              {reports.length > 0 && (
                <div onClick={() => setCurrentView('reports')} className="bg-emerald-50 p-6 rounded-[24px] paper-border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors group">
                  <h4 className="font-bold text-emerald-800 mb-2">Dernier compte rendu</h4>
                  <p className="text-sm text-emerald-700 italic line-clamp-2">"{reports[0].summary}"</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'courses': return <div className="p-4">Cours (à venir) <button onClick={() => setCurrentView('dashboard')}>Retour</button></div>;

      case 'documents':
        return (
          <div>
            <button onClick={() => setCurrentView('dashboard')} className="flex items-center gap-2 text-slate-500 font-bold mb-6"><ArrowLeft size={20} /> Retour</button>
            <DocumentList documents={documents} onDocClick={(doc) => { setSelectedDoc(doc); setCurrentView('doc-detail'); }} onAddDocument={() => { }} isAdmin={isAdmin} />
          </div>
        );

      case 'doc-detail':
        return (
          <div className="h-full flex flex-col">
            <button onClick={() => setCurrentView('documents')} className="flex items-center gap-2 text-slate-500 font-bold mb-4"><ArrowLeft size={20} /> Retour</button>
            <iframe src={selectedDoc?.file_url} className="w-full h-[80vh] rounded-2xl border-2 border-slate-200" title="Doc" />
          </div>
        );

      case 'reports':
        return (
          <div>
            <button onClick={() => setCurrentView('dashboard')} className="flex items-center gap-2 text-slate-500 font-bold mb-6"><ArrowLeft size={20} /> Retour</button>
            <SessionReportList reports={reports} onReportClick={(r) => { setSelectedReport(r); setCurrentView('report-detail'); }} />
          </div>
        );

      case 'report-detail':
        return (
          <div>
            <button onClick={() => setCurrentView('reports')} className="flex items-center gap-2 text-slate-500 font-bold mb-6"><ArrowLeft size={20} /> Retour</button>
            {selectedReport && <SessionReportDetail report={selectedReport} />}
          </div>
        );

      case 'profile':
      case 'onboarding':
        return (
          <ProfileForm
            userId={viewingStudentId!}
            initialName={student?.name}
            initialGrade={student?.grade}
            onSave={handleProfileUpdate}
            mode={currentView === 'onboarding' ? 'onboarding' : 'settings'}
          />
        );
    }
  };

  if (!session) return <Login />;
  if (isAdmin && !viewingStudentId) return <StudentList onSelectStudent={setViewingStudentId} onLogout={handleLogout} />;

  return (
    <div className="min-h-screen flex bg-[#FAF9F6]">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} onLogout={handleLogout} isAdmin={isAdmin} onBackToAdmin={() => setViewingStudentId(null)} />

      <main className="flex-1 p-6 lg:p-12 overflow-x-hidden relative">
        {/* HEADER SIMPLE */}
        <header className="flex items-center justify-between mb-8">
          {!isAdmin && currentView !== 'onboarding' && (
            <div className="relative"><input type="text" placeholder="Rechercher..." className="pl-10 pr-4 py-2 bg-white rounded-xl paper-border outline-none" /><Search className="absolute left-3 top-2.5 text-slate-400" size={18} /></div>
          )}
          {isAdmin && (
            <button onClick={() => setViewingStudentId(null)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold">
              <ArrowLeft size={20} /> Liste des élèves
            </button>
          )}
          <div className="flex items-center gap-4">
            {isAdmin && <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">Professeur</span>}
            <div className="w-10 h-10 rounded-full bg-indigo-100 overflow-hidden border-2 border-white"><img src={student?.avatar_url || MOCK_STUDENT.avatar_url} className="w-full h-full object-cover" /></div>
          </div>
        </header>

        {renderContent()}

        {/* MODALES */}
        {isTaskModalOpen && <CreateTaskModal studentId={viewingStudentId!} onClose={() => setIsTaskModalOpen(false)} onSuccess={fetchData} />}
        {isReportModalOpen && <CreateReportModal studentId={viewingStudentId!} onClose={() => setIsReportModalOpen(false)} onSuccess={fetchData} />}
      </main>
    </div>
  );
};

export default App;
