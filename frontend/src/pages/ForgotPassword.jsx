import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetToken, setResetToken] = useState(''); // Only for hackathon demo purposes

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await axios.post('/api/auth/forgotpassword', { email });
            setMessage("Instructions generated below (Mock Flow)");
            setResetToken(res.data.resetToken);
        } catch (err) {
            setError(err.response?.data?.message || "User not found");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-10 rounded-[2rem] shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase">Identity Recovery</h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Enter your registered email to begin recovery</p>
                </div>

                {message && <div className="bg-green-50 text-green-600 p-4 rounded-2xl mb-6 text-sm font-bold border border-green-100">{message}</div>}
                {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold border border-red-100">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium"
                            placeholder="fleet-admin@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl shadow-xl shadow-gray-200 transition transform active:scale-[0.98] disabled:opacity-70 uppercase tracking-widest text-xs italic"
                    >
                        {loading ? 'Processing...' : 'Request Recovery'}
                    </button>

                    {resetToken && (
                        <div className="mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">From Here You Can Reset Your Password:</p>
                            <Link to={`/reset-password/${resetToken}`} className="text-sm font-black text-indigo-600 underline break-all">
                                Click here to go to Reset Page with Token
                            </Link>
                        </div>
                    )}
                </form>

                <div className="text-center mt-10">
                    <Link to="/login" className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-indigo-600 transition">
                        Back to Authentication
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
