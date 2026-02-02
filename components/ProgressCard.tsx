
import React from 'react';

interface ProgressCardProps {
  subject: string;
  progress: number;
  color: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ subject, progress, color }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="font-bold text-slate-700 text-sm">{subject}</span>
        <span className="text-xs font-bold text-slate-400">{progress}%</span>
      </div>
      <div className="h-3 bg-slate-50 rounded-full overflow-hidden paper-border border-slate-100">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressCard;
