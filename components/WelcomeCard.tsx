
import React from 'react';
import { Rocket } from 'lucide-react';
import { Student } from '../types';

interface WelcomeCardProps {
  student: Student;
  onRevise: () => void;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ student, onRevise }) => {
  return (
    <div className="bg-white p-8 rounded-[32px] paper-border relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
        <div className="relative shrink-0">
          <img 
            src={student.avatar} 
            alt={student.name} 
            className="w-28 h-28 md:w-36 md:h-36 rounded-3xl border-4 border-slate-50 object-cover shadow-sm -rotate-2"
          />
        </div>

        <div className="text-center md:text-left">
          <h2 className="text-4xl font-bold text-slate-800 mb-2">
            Salut {student.name} !
          </h2>
          <p className="text-slate-500 font-medium mb-6 text-lg max-w-md">
            Prête pour une nouvelle séance ? Tu as déjà complété 
            <span className="text-indigo-600 font-bold"> {student.overallProgress}% </span> 
            de tes objectifs.
          </p>
          
          <button 
            onClick={onRevise}
            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all group active:scale-95"
          >
            Réviser maintenant
            <Rocket size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Flat decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
      <div className="absolute bottom-4 right-8 text-indigo-100">
        <Rocket size={120} strokeWidth={1} />
      </div>
    </div>
  );
};

export default WelcomeCard;
