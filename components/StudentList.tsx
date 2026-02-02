import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Student } from '../types';
import { User, ChevronRight, LogOut } from 'lucide-react';

interface StudentListProps {
    onSelectStudent: (id: string) => void;
    onLogout: () => void;
}

const StudentList: React.FC<StudentListProps> = ({ onSelectStudent, onLogout }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('role', 'student');

                if (error) throw error;
                if (data) setStudents(data as Student[]);
            } catch (err) {
                console.error('Error fetching students:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF9F6] p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Mes Élèves</h1>
                        <p className="text-slate-500 mt-2">Sélectionne un profil pour voir son tableau de bord</p>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 text-slate-500 font-bold hover:text-red-500 transition-colors px-4 py-2 rounded-xl hover:bg-white"
                    >
                        <LogOut size={20} />
                        Se déconnecter
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {students.map((student) => (
                        <button
                            key={student.id}
                            onClick={() => onSelectStudent(student.id)}
                            className="bg-white p-6 rounded-[24px] paper-border hover:border-indigo-400 transition-all group text-left flex items-center gap-4 hover:shadow-lg hover:shadow-indigo-50"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border-2 border-white shadow-sm">
                                <img
                                    src={student.avatar_url || "https://picsum.photos/200"}
                                    alt={student.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">
                                    {student.name}
                                </h3>
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-wide">
                                    {student.grade}
                                </p>
                            </div>
                            <div className="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-transform">
                                <ChevronRight size={24} />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentList;
