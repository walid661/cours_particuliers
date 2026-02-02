
import React from 'react';
import { MessageSquare, ArrowRight, Calendar } from 'lucide-react';
import { SessionReport } from '../types';

interface SessionReportListProps {
  reports: SessionReport[];
  onReportClick: (report: SessionReport) => void;
}

const SessionReportList: React.FC<SessionReportListProps> = ({ reports, onReportClick }) => {
  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <div 
          key={report.id}
          onClick={() => onReportClick(report)}
          className="bg-white rounded-2xl paper-border overflow-hidden cursor-pointer hover:border-indigo-300 transition-all flex group"
        >
          {/* Notebook Margin Strip */}
          <div className={`w-3 ${report.isNew ? 'bg-indigo-500' : 'bg-slate-100'} transition-colors`}></div>
          
          <div className="p-6 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors shrink-0">
                <Calendar size={22} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-bold text-lg text-slate-800">{report.subject}</h4>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{report.date}</span>
                  {report.isNew && (
                    <span className="bg-emerald-100 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full font-bold">NOUVEAU</span>
                  )}
                </div>
                <p className="text-slate-500 text-sm line-clamp-1 italic">
                  "{report.summary}"
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all">
              <span className="text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Lire la suite</span>
              <ArrowRight size={20} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SessionReportList;
