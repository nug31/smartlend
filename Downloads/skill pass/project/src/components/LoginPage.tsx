import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, User, GraduationCap } from 'lucide-react';
import smkLogo from '../assets/smk-logo.png';

export function LoginPage() {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const success = await login(username, password);

        if (success) {
            // Login successful - AuthContext will handle state update
        } else {
            setError('Username atau password salah');
        }

        setLoading(false);
    };



    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0a0e1a] via-[#1a1f3a] to-[#0a0e1a]">
            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <img
                            src={smkLogo}
                            alt="SMK Logo"
                            className="w-20 h-20 rounded-full object-cover bg-white p-2 shadow-2xl"
                        />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                        Skill Passport
                    </h1>
                    <p className="text-white/60 text-sm">Competency & achievement tracker</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                            type="button"
                            onClick={() => setSelectedRole('student')}
                            className={`p-4 rounded-xl border transition-all ${selectedRole === 'student'
                                ? 'border-purple-400 bg-purple-400/20 text-white'
                                : 'border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <User className="w-6 h-6 mx-auto mb-2" />
                            <div className="text-sm font-medium">Siswa</div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRole('teacher')}
                            className={`p-4 rounded-xl border transition-all ${selectedRole === 'teacher'
                                ? 'border-indigo-400 bg-indigo-400/20 text-white'
                                : 'border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <GraduationCap className="w-6 h-6 mx-auto mb-2" />
                            <div className="text-sm font-medium">Guru</div>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username Input */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-2">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all"
                                placeholder={selectedRole === 'student' ? 'siswa_mesin' : 'guru'}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Logging in...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>Login</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
