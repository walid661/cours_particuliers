import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CreateTaskModalProps {
    studentId: string;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ studentId, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Devoirs');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from('tasks').insert({
                student_id: studentId,
                title,
                category,
                due_date: dueDate,
                is_completed: false,
                color: 'bg-white'
            });

            if (error) throw error;
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la création du devoir.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[24px] p-8 max-w-md w-full shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Donner un devoir</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Titre</label>
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Ex: Exercices page 42..."
                            className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Matière</label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                            >
                                <option>Maths</option>
                                <option>Français</option>
                                <option>Anglais</option>
                                <option>Autre</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Pour quand ?</label>
                            <input
                                type="text"
                                value={dueDate}
                                onChange={e => setDueDate(e.target.value)}
                                placeholder="Ex: Demain"
                                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2"
                    >
                        {loading ? 'Envoi...' : <><Check size={18} /> Assigner le devoir</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;
