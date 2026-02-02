import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Mail, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                // Optional: Check if email confirmation is required? 
                // For this demo, assuming auto-confirm or user manually confirms.
                alert('Compte créé ! Connecte-toi maintenant.');
                setIsSignUp(false);
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
            <div className="bg-white p-8 md:p-12 rounded-[32px] paper-border max-w-md w-full shadow-sm">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800">EduSoft</h1>
                    <p className="text-slate-500 mt-2">
                        {isSignUp ? 'Crée ton compte pour commencer' : 'Connecte-toi pour accéder à tes cours'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl border-2 border-red-100 mb-6 text-sm font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-6">
                    <div>
                        <label className="block text-slate-700 font-bold mb-2 ml-1">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl paper-border focus:border-indigo-400 outline-none transition-all"
                                placeholder="exemple@email.com"
                                required
                            />
                            <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-700 font-bold mb-2 ml-1">Mot de passe</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl paper-border focus:border-indigo-400 outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                            <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Chargement...' : (isSignUp ? "S'inscrire" : 'Se connecter')}
                        {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                    </button>

                    <div className="text-center mt-6">
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-indigo-600 font-bold text-sm hover:underline"
                        >
                            {isSignUp ? "J'ai déjà un compte" : "Je n'ai pas de compte"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
