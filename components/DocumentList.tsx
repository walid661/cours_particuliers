
import React from 'react';
import { FileText, File, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { Document } from '../types';

interface DocumentListProps {
  documents: Document[];
  onDocClick: (doc: Document) => void;
  onAddDocument: (file: File) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, onDocClick, onAddDocument }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="text-rose-400" size={18} />;
      case 'image': return <ImageIcon className="text-sky-400" size={18} />;
      default: return <File className="text-indigo-400" size={18} />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-[24px] paper-border">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <FileText className="text-indigo-400" size={24} />
        Derniers Documents
      </h3>

      <div className="mb-4">
        <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50 text-indigo-500 font-bold cursor-pointer hover:bg-indigo-100 transition-all">
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onAddDocument(e.target.files[0]);
              }
            }}
          />
          + Ajouter un document
        </label>
      </div>

      <div className="space-y-2">
        {documents.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onDocClick(doc)}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all border-2 border-transparent hover:border-slate-100 group text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border-2 border-white shadow-sm">
                {getIcon(doc.type)}
              </div>
              <div>
                <p className="font-bold text-slate-700 text-sm">{doc.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{doc.date} • {doc.size}</p>
              </div>
            </div>

            <div className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all">
              <ArrowRight size={18} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;
