
import ProfileForm from './components/ProfileForm';

type View = 'dashboard' | 'courses' | 'documents' | 'doc-detail' | 'reports' | 'report-detail' | 'profile' | 'onboarding';

const ADMIN_EMAIL = 'w.elghouti@gmail.com';

const App: React.FC = () => {
  // ... existing state ... 

  // Data Fetching Effect (Existing + Updates)
  useEffect(() => {
    if (!session || !viewingStudentId) return;

    const fetchData = async () => {
      setIsLoading(true);

      // ... Supabase config check ...

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

        // ... Fetch subjects, tasks, docs, reports ...
        // ... (Keep existing fetch logic) ...

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session, viewingStudentId, isAdmin]); // Added isAdmin to deps

  // ... handlers ...

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

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
      // ...

      // ... other cases ...

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

      // Note: 'onboarding' is handled separately to return full screen
    }
  };

  // Auth Layout Logic
  if (!session) return <Login />;

  // Admin View
  if (isAdmin && !viewingStudentId) return <StudentList onSelectStudent={setViewingStudentId} onLogout={handleLogout} />;

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

  // User View (Main App)
  return (
    <div className="min-h-screen flex bg-[#FAF9F6]">
      <Sidebar currentView={currentView} onNavigate={navigateTo} onLogout={handleLogout} />
      <main className="flex-1 p-6 lg:p-12 overflow-x-hidden">
        {currentView !== 'profile' && (
          <header className="flex items-center justify-between mb-12">
            {/* ... Existing Header ... */}
          </header>
        )}
        {currentView === 'profile' && (
          <div className="mb-8">
            <button onClick={() => navigateTo('dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-6 transition-all">
              <ArrowLeft size={20} /> Retour au tableau de bord
            </button>
          </div>
        )}
        {/* ... Error & RenderContent ... */}
      </main>
    </div>
  );
};

export default App;
