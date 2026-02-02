
import React from 'react';
import { MessageSquare, Target, ClipboardList, Quote } from 'lucide-react';
import { SessionReport } from '../types';

interface SessionReportDetailProps {
  report: SessionReport;
}

const SessionReportDetail: React.FC<SessionReportDetailProps> = ({ report }) => {
  return (
    <div className="bg-white rounded-[32px] paper-border overflow-hidden relative min-h-[700px]">
      {/* Notebook red line margin effect */}
      <div className="absolute left-12 top-0 bottom-0 w-[2px] bg-red-100"></div>

      <div className="p-12 pl-24 relative z-10">
        <div className="mb-12">
          <div className="flex items-center gap-3 text-slate-400 uppercase text-xs font-black tracking-widest mb-2">
            <ClipboardList size={14} />
            Séance du {report.date}
          </div>
          <h2 className="text-4xl font-bold text-slate-800">{report.subject}</h2>
        </div>

        <div className="space-y-12">
          {/* Summary Section */}
          <section>
            <h3 className="text-lg font-bold text-indigo-600 mb-4 flex items-center gap-2">
              <Quote size={20} />
              En résumé
            </h3>
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 italic text-slate-700 leading-relaxed">
              "{report.summary}"
            </div>
          </section>

          {/* Teacher's Feedback */}
          <section>
            <h3 className="text-lg font-bold text-indigo-600 mb-4 flex items-center gap-2">
              <MessageSquare size={20} />
              Commentaires du professeur
            </h3>
            <p className="text-slate-700 leading-loose text-lg font-medium">
              {report.fullFeedback}
            </p>
          </section>

          {/* Next Steps / Goals */}
          <section className="bg-indigo-50/50 p-8 rounded-3xl border-2 border-indigo-100">
            <h3 className="text-lg font-bold text-indigo-800 mb-6 flex items-center gap-2">
              <Target size={20} />
              Objectifs pour la prochaine séance
            </h3>
            <ul className="space-y-4">
              {report.nextGoals.map((goal, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700 font-bold">
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-indigo-200 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                  </div>
                  {goal}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t-2 border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
            <div>
              <p className="text-sm font-bold text-slate-800">M. Durand</p>
              <p className="text-xs text-slate-400">Ton professeur particulier</p>
            </div>
          </div>
          <button className="bg-slate-100 text-slate-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
            Poser une question
          </button>
        </div>
      </div>
      
      {/* Visual background element */}
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <MessageSquare size={300} strokeWidth={1} />
      </div>
    </div>
  );
};

export default SessionReportDetail;
