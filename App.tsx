import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Search,
  ArrowLeft,
  MessageSquare,
  Plus,
  FilePlus
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
import ProfileForm from './components/ProfileForm'; // Added ProfileForm import
import { MOCK_STUDENT } from './constants';
import { Document, SessionReport } from './types';
import { supabase } from './lib/supabase';

type View = 'dashboard' | 'courses' | 'documents' | 'doc-detail' | 'reports' | 'report-detail' | 'profile' | 'onboarding';

const ADMIN_EMAIL = 'w.elghouti@gmail.com';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewingStudentId, setViewingStudentId] = useState<string | null>(null);

  const [student, setStudent] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [selectedReport, setSelectedReport] = useState<SessionReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkUserRole(session?.user.id, session?.user.email);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      checkUserRole(session?.user.id, session?.user.email);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
    setViewingStudentId(null);
  };

  const checkUserRole = async (userId?: string, email?: string) => {
    if (!userId) {
      setIsAdmin(false);
      return;
    }

    // 1. Hardcoded Admin Check
    if (email === ADMIN_EMAIL) {
      setIsAdmin(true);
      return;
    }

    // 2. Database Role Check (Fallback)
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    // Security Fix: Detect Ghost Users
    if (error || !data) {
      console.warn("Utilisateur authentifié mais sans profil. Déconnexion forcée.");
      await handleLogout();
      alert("Ce compte n'a pas de profil actif ou a été supprimé. Contactez votre professeur.");
      return;
    }

    if (data?.role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      setViewingStudentId(userId); // Student views themselves
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ is_completed: !currentStatus })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, is_completed: !currentStatus } : t
      ));
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleProfileUpdate = async () => {
    // Re-fetch profile data to update UI
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', viewingStudentId)
      .single();
    if (data) setStudent(data);

    // If we were onboarding, go to dashboard
    if (currentView === 'onboarding') {
      setCurrentView('dashboard');
    } else {
      alert('Profil mis à jour !');
    }
  };

  // Data Fetching Effect (Existing + Updates)
  useEffect(() => {
    if (!session || !viewingStudentId) return;

    const fetchData = async () => {
      setIsLoading(true);

      /* @ts-ignore */
      if (supabase.supabaseUrl === 'https://placeholder.supabase.co') {
        setError("Configuration manquante : Vérifiez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env");
        setIsLoading(false);
        return;
      }

      try {
        // 1. Fetch Student Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', viewingStudentId)
          .single();

        if (profileData) {
          setStudent(profileData);

          // Onboarding Check: If student view and name is empty, force onboarding
          if (!isAdmin && (!profileData.name || profileData.name.trim() === '')) {
            setCurrentView('onboarding');
            setIsLoading(false);
            return; // Stop fetching other data if onboarding is needed
          }
        }

        // 2. Fetch Subjects
        const { data: subjectsData } = await supabase
          .from('subjects')
          .select('*')
          .eq('student_id', viewingStudentId);
        if (subjectsData) setSubjects(subjectsData);

        // 3. Fetch Tasks
        const { data: tasksData } = await supabase
          .from('tasks')
          .select('*')
          .eq('student_id', viewingStudentId)
          .order('created_at', { ascending: false });
        if (tasksData) setTasks(tasksData);

        // 4. Fetch Documents
        const { data: docsData, error: docsError } = await supabase
          .from('documents')
          .select('*')
          .eq('student_id', viewingStudentId)
          .order('created_at', { ascending: false });

        if (docsError) throw docsError;

        if (docsData) {
          const mappedDocs: Document[] = docsData.map((d: any) => ({
            id: d.id,
            name: d.name,
            type: d.type,
            size: d.size,
            created_at: new Date(d.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
            file_url: d.file_url,
            student_id: d.student_id
          }));
          setDocuments(mappedDocs);
        }

        // 5. Fetch Reports
        const { data: reportsData } = await supabase
          .from('sessions_reports')
          .select('*')
          .eq('student_id', viewingStudentId)
          .order('created_at', { ascending: false });

        if (reportsData) {
          const mappedReports = reportsData.map((r: any) => ({
            ...r,
            created_at: new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
          }));
          setReports(mappedReports);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session, viewingStudentId, isAdmin]);

  const navigateTo = (view: View) => setCurrentView(view);

  const handleDocClick = (doc: Document) => {
    setSelectedDoc(doc);
    setCurrentView('doc-detail');
  };

  const handleReportClick = (report: SessionReport) => {
    setSelectedReport(report);
    setCurrentView('report-detail');
  };

  const handleAddDocument = async (file: File) => {
    if (!session) return;
    setIsLoading(true);
    try {
      // 1. Upload to Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // 3. Insert into Database
      const newDocPayload = {
        name: file.name,
        type: file.name.endsWith('.pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'doc',
        size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
        file_url: publicUrl,
        student_id: viewingStudentId // Associate with current student
      };

      const { data: insertData, error: insertError } = await supabase
        .from('documents')
        .insert([newDocPayload])
        .select();

      if (insertError) throw insertError;

      if (insertData && insertData[0]) {
        const d = insertData[0];
        const newDoc: Document = {
          id: d.id,
          name: d.name,
          type: d.type,
          size: d.size,
          created_at: new Date(d.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
          file_url: d.file_url,
          student_id: d.student_id
        };
        setDocuments(prev => [newDoc, ...prev]);
      }

    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Oups, le fichier n\'a pas pu être envoyé.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        const overallProgress = subjects.length > 0
          ? Math.round(subjects.reduce((acc, curr) => acc + (curr.progress || 0), 0) / subjects.length)
          : 0;

        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="xl:col-span-2 space-y-8">
              <WelcomeCard
                student={student || MOCK_STUDENT}
                overallProgress={overallProgress}
                onRevise={() => navigateTo('courses')}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-[24px] paper-border">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <BookOpen className="text-blue-400" size={24} />
                    Mes Progrès
                  </h3>
                  <div className="space-y-6">
                    {subjects.map((sub, idx) => (
                      <ProgressCard key={idx} subject={sub.name} progress={sub.progress} color={sub.color} />
                    ))}
                    {subjects.length === 0 && <p className="text-slate-400 italic">Aucune matière trouvée.</p>}
                  </div>
                </div>

                {isLoading ? (
                  <div className="p-4 text-center text-slate-400 italic">Chargement des documents...</div>
                ) : (
                  <DocumentList documents={documents} onDocClick={handleDocClick} onAddDocument={handleAddDocument} isAdmin={isAdmin} />
                )}
              </div>
            </div>

            <div className="space-y-8">
              {isAdmin && (
                <button
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                  onClick={() => alert('Fonctionnalité "Ajouter une tâche" à venir')}
                >
                  <Plus size={20} />
                  Ajouter une tâche
                </button>
              )}
              <TaskBoard tasks={tasks} />

              {reports.length > 0 && (
                <div
                  onClick={() => navigateTo('reports')}
                  className="bg-emerald-50 p-6 rounded-[24px] paper-border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-emerald-800">Dernier compte rendu</h4>
                    {reports[0].is_new && (
                      <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">NOUVEAU</span>
                    )}
                  </div>
                  <p className="text-sm text-emerald-700 leading-relaxed mb-4 italic line-clamp-2">
                    "{reports[0].summary}"
                  </p>
                  <span className="text-emerald-800 text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Tout lire <ArrowLeft size={14} className="rotate-180" />
                  </span>
                </div>
              )}
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <button onClick={() => navigateTo('dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-6 transition-all">
              <ArrowLeft size={20} /> Retour au tableau de bord
            </button>
            <h2 className="text-3xl font-bold mb-8">Mes Cours</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((sub, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[24px] paper-border hover:border-indigo-200 transition-colors cursor-pointer group">
                  <div className={`w-12 h-12 ${sub.color} rounded-2xl mb-4 opacity-80 group-hover:opacity-100`}></div>
                  <h3 className="text-xl font-bold mb-2">{sub.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">Dernière séance : il y a 2 jours</p>
                  <div className="h-2 w-full bg-slate-100 rounded-full">
                    <div className={`h-full ${sub.color} rounded-full`} style={{ width: `${sub.progress}%` }}></div>
                  </div>
                </div>
              ))}
              {subjects.length === 0 && <p className="text-slate-500">Aucun cours trouvé.</p>}
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <button onClick={() => navigateTo('dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-6 transition-all">
              <ArrowLeft size={20} /> Retour
            </button>
            <h2 className="text-3xl font-bold mb-8">Tous mes Documents</h2>
            <DocumentList documents={documents} onDocClick={handleDocClick} onAddDocument={handleAddDocument} isAdmin={isAdmin} />
          </div>
        );

      case 'doc-detail':
        return (
          <div className="animate-in fade-in zoom-in-95 duration-300 max-w-4xl mx-auto">
            <button onClick={() => navigateTo('documents')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-6 transition-all">
              <ArrowLeft size={20} /> Retour aux documents
            </button>
            <div className="bg-white p-10 rounded-[32px] paper-border min-h-[600px] flex flex-col items-center justify-center text-center w-full">
              {selectedDoc?.type === 'pdf' || selectedDoc?.file_url ? (
                <div className="w-full h-[600px] bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200">
                  <iframe
                    src={selectedDoc?.file_url || 'https://pdfobject.com/pdf/sample.pdf'}
                    className="w-full h-full"
                    title="Document Viewer"
                  />
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-500 mb-6">
                    <FileText size={40} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{selectedDoc?.name}</h2>
                  <p className="text-slate-400 mb-8 tracking-wide uppercase text-xs font-bold">
                    {selectedDoc?.type.toUpperCase()} • {selectedDoc?.size} • Ajouté le {selectedDoc?.created_at}
                  </p>
                  <div className="w-full max-w-md bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 mb-8">
                    <p className="text-slate-500 italic">"L'aperçu du document sera disponible prochainement."</p>
                  </div>
                  <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
                    Télécharger le document
                  </button>
                </>
              )}
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <button onClick={() => navigateTo('dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-6 transition-all">
              <ArrowLeft size={20} /> Retour
            </button>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Comptes Rendus de séances</h2>
              <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-bold text-sm">
                {reports.length} séances au total
              </div>
            </div>

            {isAdmin && (
              <button
                className="w-full mb-8 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                onClick={() => alert('Fonctionnalité "Nouveau Compte Rendu" à venir')}
              >
                <FilePlus size={20} />
                Nouveau Compte Rendu
              </button>
            )}

            <SessionReportList reports={reports} onReportClick={handleReportClick} />
          </div>
        );

      case 'report-detail':
        return (
          <div className="animate-in fade-in zoom-in-95 duration-300 max-w-3xl mx-auto">
            <button onClick={() => navigateTo('reports')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-6 transition-all">
              <ArrowLeft size={20} /> Retour aux comptes rendus
            </button>
            {selectedReport && <SessionReportDetail report={selectedReport} />}
          </div>
        );

      case 'profile':
        return (
          <ProfileForm
            userId={viewingStudentId!} // Safe because we check viewingStudentId
            initialName={student?.name}
            initialGrade={student?.grade}
            onSave={handleProfileUpdate}
            mode="settings"
          />
        );
    }
  };

  // Auth Layout Logic
  if (!session) {
    return <Login />;
  }

  if (isAdmin && !viewingStudentId) {
    return <StudentList onSelectStudent={setViewingStudentId} onLogout={handleLogout} />;
  }

  // User View (Onboarding Block)
  if (currentView === 'onboarding') {
    return (
      <ProfileForm
        userId={viewingStudentId!}
        initialName={student?.name}
        initialGrade={student?.grade}
        onSave={handleProfileUpdate}
        mode="onboarding"
      />
    );
  }

  return (
    <div className="min-h-screen flex bg-[#FAF9F6]">
      <Sidebar currentView={currentView} onNavigate={navigateTo} onLogout={handleLogout} />

      <main className="flex-1 p-6 lg:p-12 overflow-x-hidden">
        {/* Simple Header */}
        <header className="flex items-center justify-between mb-12">
          {currentView !== 'profile' && (
            <div className="relative group">
              <input
                type="text"
                placeholder="Chercher..."
                className="pl-10 pr-4 py-2 bg-white rounded-xl paper-border focus:border-indigo-400 outline-none w-48 md:w-64 transition-all"
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            </div>
          )}
          {currentView === 'profile' && (
            <div></div> // Spacer when search is hidden
          )}

          <div className="flex items-center gap-4">
            {isAdmin && (
              <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Mode Professeur
              </span>
            )}
            <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white overflow-hidden paper-border">
              <img src={student?.avatar_url || MOCK_STUDENT.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {currentView === 'profile' && (
          <div className="mb-8">
            <button onClick={() => navigateTo('dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-6 transition-all">
              <ArrowLeft size={20} /> Retour au tableau de bord
            </button>
          </div>
        )}

        {error ? (
          <div className="p-8 bg-red-50 text-red-600 rounded-2xl border-2 border-red-100 mb-8 font-bold text-center">
            {error}
          </div>
        ) : null}
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
