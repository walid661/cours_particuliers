import React from 'react';
import { Rocket } from 'lucide-react';
import { Student } from '../types';

interface WelcomeCardProps {
  student: Student;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ student }) => {
  return (
    <div className="bg-white p-8 rounded-[32px] paper-border relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
        <div className="relative shrink-0">
          <img
            src={student.avatar_url || "https://picsum.photos/200"}
            alt={student.name}
            className="w-28 h-28 md:w-36 md:h-36 rounded-3xl border-4 border-slate-50 object-cover shadow-sm -rotate-2"
          />
        </div>

        <div className="text-center md:text-left">
          <h2 className="text-4xl font-bold text-slate-800 mb-2">
            Salut {student.name} !
          </h2>
          <p className="text-slate-500 font-medium text-lg max-w-md">
            Retrouve ici tes documents de cours et les comptes rendus de tes séances.
          </p>
        </div>
      </div>

      {/* Éléments décoratifs discrets */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
    </div>
  );
};

export default WelcomeCard;
