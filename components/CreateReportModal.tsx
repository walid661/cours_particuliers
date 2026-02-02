import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CreateReportModalProps {
    studentId: string;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateReportModal: React.FC<CreateReportModalProps> = ({ studentId, onClose, onSuccess }) => {
    const [summary, setSummary] = useState('');
    const [subject, setSubject] = useState('Maths');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from('sessions_reports').insert({
                student_id: studentId,
                summary,
                subject,
                date,
                full_feedback: feedback,
                is_new: true,
                next_goals: [] // Tu pourras améliorer ça plus tard
            });

            if (error) throw error;
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la création du rapport.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[24px] p-8 max-w-lg w-full shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Nouveau Compte Rendu</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Matière</label>
                            <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <option>Maths</option>
                                <option>Français</option>
                                <option>Anglais</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Résumé (Titre)</label>
                        <input
                            required
                            type="text"
                            value={summary}
                            onChange={e => setSummary(e.target.value)}
                            placeholder="Ex: Séance productive sur les fractions"
                            className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Détails de la séance</label>
                        <textarea
                            required
                            rows={4}
                            value={feedback}
                            onChange={e => setFeedback(e.target.value)}
                            placeholder="Points abordés, difficultés, réussites..."
                            className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none resize-none"
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2"
                    >
                        {loading ? 'Sauvegarde...' : <><Check size={18} /> Publier le rapport</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateReportModal;
