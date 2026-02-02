
import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  GraduationCap,
  MessageSquare
} from 'lucide-react';
// Fix: Added import for MOCK_STUDENT from constants file
import { MOCK_STUDENT } from '../constants';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: any) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-bold ${
      active 
      ? 'bg-indigo-600 text-white shadow-md' 
      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
    }`}
  >
    <span className={active ? 'text-white' : 'text-slate-400'}>{icon}</span>
    <span className="text-sm">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  return (
    <aside className="w-20 lg:w-64 bg-white border-r-2 border-slate-100 flex flex-col p-4 transition-all duration-300">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0">
          <GraduationCap size={24} />
        </div>
        <span className="hidden lg:block text-xl font-bold text-slate-800 tracking-tight">EduSoft</span>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem 
          icon={<LayoutDashboard size={20} />} 
          label="Tableau de Bord" 
          active={currentView === 'dashboard'} 
          onClick={() => onNavigate('dashboard')}
        />
        <NavItem 
          icon={<BookOpen size={20} />} 
          label="Mes Cours" 
          active={currentView === 'courses'} 
          onClick={() => onNavigate('courses')}
        />
        <NavItem 
          icon={<MessageSquare size={20} />} 
          label="Comptes Rendus" 
          active={currentView === 'reports' || currentView === 'report-detail'} 
          onClick={() => onNavigate('reports')}
        />
        <NavItem 
          icon={<FileText size={20} />} 
          label="Documents" 
          active={currentView === 'documents' || currentView === 'doc-detail'} 
          onClick={() => onNavigate('documents')}
        />
      </nav>

      <div className="mt-auto hidden lg:block">
        <div className="bg-slate-50 p-4 rounded-2xl paper-border border-dashed border-slate-200">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Session active</p>
          <p className="text-slate-800 text-xs font-bold">{MOCK_STUDENT.name} • {MOCK_STUDENT.grade}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
