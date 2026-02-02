
import React from 'react';
import { CheckCircle2, Circle, PencilLine } from 'lucide-react';
import { Task } from '../types';

interface TaskBoardProps {
  tasks: Task[];
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks }) => {
  return (
    <div className="bg-white p-6 rounded-[24px] paper-border">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <PencilLine className="text-indigo-400" size={24} />
        À faire
      </h3>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className={`${task.color} p-4 rounded-xl border-2 border-white paper-border cursor-pointer transition-transform hover:scale-[1.02] flex items-start gap-3`}
          >
            <button className={`mt-1 ${task.isCompleted ? 'text-indigo-600' : 'text-slate-400'}`}>
              {task.isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            </button>
            <div className="flex-1">
              <p className={`font-bold text-slate-800 text-sm ${task.isCompleted ? 'line-through opacity-40' : ''}`}>
                {task.title}
              </p>
              <p className="text-[10px] font-bold uppercase text-slate-500 mt-1 opacity-60">
                {task.category} • {task.dueDate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
