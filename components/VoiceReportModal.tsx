import React, { useState, useEffect } from 'react';
import { X, Mic, StopCircle, MessageCircle, Mail, Smartphone, Wand2, Loader2 } from 'lucide-react';
import { generateProfessionalMessage } from '../lib/openai';

// --- UTILITAIRE VOCAL (INTERNE) ---
// On utilise l'API Web Speech standard (gratuite et rapide) pour la transcription
const startSpeechRecognition = (onResult: (text: string) => void, onEnd: () => void) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Désolé, la reconnaissance vocale n'est supportée que sur Chrome/Safari/Edge.");
        return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.interimResults = true; // On voit le texte s'écrire en direct
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            }
        }
        if (finalTranscript) onResult(finalTranscript);
    };

    recognition.onend = onEnd;
    recognition.start();
    return recognition;
};

// --- COMPOSANT MODAL ---

interface VoiceReportModalProps {
    studentName: string;
    onClose: () => void;
}

const VoiceReportModal: React.FC<VoiceReportModalProps> = ({ studentName, onClose }) => {
    const [step, setStep] = useState<'idle' | 'listening' | 'processing' | 'ready'>('idle');
    const [rawText, setRawText] = useState('');
    const [finalMessage, setFinalMessage] = useState('');
    const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

    // Nettoyage si on ferme la modale brutalement
    useEffect(() => {
        return () => {
            if (recognitionInstance) recognitionInstance.stop();
        };
    }, [recognitionInstance]);

    const handleStartListening = () => {
        setStep('listening');
        setRawText(''); // Reset

        const recognition = startSpeechRecognition(
            (text) => setRawText(prev => prev + " " + text), // Accumule le texte
            () => { /* Fin silencieuse, on gère l'arrêt manuellement */ }
        );
        setRecognitionInstance(recognition);
    };

    const handleStopAndProcess = async () => {
        if (recognitionInstance) recognitionInstance.stop();
        setStep('processing');

        // Appel à la vraie API OpenAI
        const aiResponse = await generateProfessionalMessage(rawText, studentName);

        setFinalMessage(aiResponse);
        setStep('ready');
    };

    const handleShare = (platform: 'whatsapp' | 'mail' | 'sms') => {
        const encoded = encodeURIComponent(finalMessage);
        let url = '';

        switch (platform) {
            case 'whatsapp': url = `https://wa.me/?text=${encoded}`; break;
            case 'mail': url = `mailto:?subject=Bilan Séance ${studentName}&body=${encoded}`; break;
            case 'sms': url = `sms:?body=${encoded}`; break; // Sur mobile, ça ouvre l'app Message
        }
        window.open(url, '_blank');
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl relative overflow-hidden border border-slate-100">

                {/* BOUTON FERMER */}
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X size={24} className="text-slate-400" />
                </button>

                {/* HEADER */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                        <Wand2 size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Bilan Vocal IA</h2>
                    <p className="text-slate-500 text-sm">Racontez la séance, l'IA rédige pour vous.</p>
                </div>

                {/* CONTENU DYNAMIQUE */}
                <div className="min-h-[220px] flex flex-col items-center justify-center transition-all">

                    {/* ÉTAPE 1 : IDLE */}
                    {step === 'idle' && (
                        <button
                            onClick={handleStartListening}
                            className="group relative flex items-center justify-center"
                        >
                            <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 group-hover:scale-125 transition-transform duration-500"></div>
                            <div className="w-20 h-20 bg-red-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-red-200 z-10 hover:scale-105 transition-transform">
                                <Mic size={32} />
                            </div>
                            <span className="absolute -bottom-10 text-slate-400 font-bold text-sm">Appuyez pour dicter</span>
                        </button>
                    )}

                    {/* ÉTAPE 2 : ÉCOUTE */}
                    {step === 'listening' && (
                        <div className="w-full flex flex-col items-center">
                            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <Mic size={40} className="text-red-500" />
                            </div>

                            <div className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 h-24 overflow-y-auto">
                                <p className="text-slate-600 text-sm italic text-center">
                                    "{rawText || "Je vous écoute..."}"
                                </p>
                            </div>

                            <button
                                onClick={handleStopAndProcess}
                                className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-900 transition-colors shadow-lg"
                            >
                                <StopCircle size={20} /> Terminer et Générer
                            </button>
                        </div>
                    )}

                    {/* ÉTAPE 3 : TRAITEMENT IA */}
                    {step === 'processing' && (
                        <div className="flex flex-col items-center">
                            <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
                            <p className="text-indigo-900 font-bold text-lg">L'IA rédige le message...</p>
                            <p className="text-slate-400 text-sm mt-2">Reformulation professionnelle en cours</p>
                        </div>
                    )}

                    {/* ÉTAPE 4 : RÉSULTAT */}
                    {step === 'ready' && (
                        <div className="w-full space-y-4 animate-in slide-in-from-bottom-4">
                            <textarea
                                value={finalMessage}
                                onChange={(e) => setFinalMessage(e.target.value)}
                                className="w-full h-40 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 focus:border-indigo-500 outline-none text-slate-700 text-sm resize-none"
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => handleShare('whatsapp')} className="col-span-2 flex items-center justify-center gap-2 p-3 bg-[#25D366] text-white rounded-xl hover:bg-[#20bd5a] font-bold shadow-md shadow-green-100 transition-transform active:scale-95">
                                    <MessageCircle size={20} /> Envoyer sur WhatsApp
                                </button>
                                <button onClick={() => handleShare('sms')} className="flex items-center justify-center gap-2 p-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-bold text-xs">
                                    <Smartphone size={18} /> SMS
                                </button>
                                <button onClick={() => handleShare('mail')} className="flex items-center justify-center gap-2 p-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-bold text-xs">
                                    <Mail size={18} /> Email
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default VoiceReportModal;
