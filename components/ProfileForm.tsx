import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Save, GraduationCap } from 'lucide-react';

interface ProfileFormProps {
    initialName?: string;
    initialGrade?: string;
    userId: string;
    onSave: () => void;
    mode: 'onboarding' | 'settings';
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialName = '', initialGrade = '', userId, onSave, mode }) => {
    const [name, setName] = useState(initialName);
    const [grade, setGrade] = useState(initialGrade);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ name, grade })
                .eq('id', userId);

            if (error) throw error;
            onSave();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Erreur lors de la mise à jour du profil.');
        } finally {
            setLoading(false);
        }
    };

    const isOnboarding = mode === 'onboarding';

    return (
        <div className={`flex flex-col items-center justify-center ${isOnboarding ? 'min-h-screen bg-[#FAF9F6] p-4' : 'animate-in fade-in slide-in-from-right-4 duration-300'}`}>
            <div className={`bg-white p-8 md:p-12 rounded-[32px] paper-border w-full ${isOnboarding ? 'max-w-md shadow-lg shadow-indigo-100/50' : 'max-w-2xl'}`}>

                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                        {isOnboarding ? <GraduationCap size={32} /> : <User size={32} />}
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800">
                        {isOnboarding ? 'Bienvenue ! 🚀' : 'Mon Profil'}
                    </h2>
                    <p className="text-slate-500 mt-2">
                        {isOnboarding
                            ? "Faisons connaissance avant de commencer."
                            : "Mets à jour tes informations personnelles."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-slate-700 font-bold mb-2 ml-1">Ton Prénom & Nom</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl paper-border focus:border-indigo-400 outline-none transition-all"
                                placeholder="Ex: Thomas Dupont"
                                required
                            />
                            <User className="absolute left-4 top-3.5 text-slate-400" size={20} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-700 font-bold mb-2 ml-1">Ta Classe</label>
                        <div className="relative">
                            <select
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl paper-border focus:border-indigo-400 outline-none transition-all appearance-none cursor-pointer text-slate-700"
                                required
                            >
                                <option value="" disabled>Choisis ta classe...</option>
                                <option value="6ème">6ème</option>
                                <option value="5ème">5ème</option>
                                <option value="4ème">4ème</option>
                                <option value="3ème">3ème</option>
                                <option value="Autre">Autre</option>
                            </select>
                            <GraduationCap className="absolute left-4 top-3.5 text-slate-400" size={20} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {loading ? 'Enregistrement...' : (isOnboarding ? 'C\'est parti !' : 'Enregistrer les modifications')}
                        {!loading && isOnboarding && <span className="group-hover:translate-x-1 transition-transform">→</span>}
                        {!loading && !isOnboarding && <Save size={20} />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileForm;
