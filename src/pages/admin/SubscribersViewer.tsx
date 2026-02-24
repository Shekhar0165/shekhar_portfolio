import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, Mail, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../components/ui/button';

interface SubscriberType {
    _id: string;
    email: string;
    active: boolean;
    createdAt: string;
}

const SubscribersViewer = () => {
    const [subscribers, setSubscribers] = useState<SubscriberType[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSubscribers = async () => {
        try {
            const res = await api.get('/subscribers');
            setSubscribers(res.data);
        } catch (err) {
            console.error('Failed to fetch subscribers:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const handleRemove = async (email: string) => {
        if (!window.confirm(`Remove ${email}?`)) return;
        try {
            await api.delete(`/subscribers/${email}`);
            fetchSubscribers();
        } catch (err) {
            console.error('Failed to remove subscriber:', err);
        }
    };

    const activeCount = subscribers.filter((s) => s.active).length;

    return (
        <div>
            <Helmet>
                <title>Subscribers | Admin</title>
            </Helmet>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Users size={24} /> Newsletter Subscribers
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                        {activeCount} active / {subscribers.length} total
                    </p>
                </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total</p>
                    <p className="text-3xl font-bold">{subscribers.length}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <p className="text-xs text-green-400 uppercase tracking-wider mb-1">Active</p>
                    <p className="text-3xl font-bold text-green-400">{activeCount}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <p className="text-xs text-red-400 uppercase tracking-wider mb-1">Unsubscribed</p>
                    <p className="text-3xl font-bold text-red-400">{subscribers.length - activeCount}</p>
                </div>
            </div>

            {/* Subscribers list */}
            {loading ? (
                <p className="text-center text-slate-400 py-10">Loading...</p>
            ) : subscribers.length === 0 ? (
                <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <Mail size={48} className="mx-auto text-slate-600 mb-4" />
                    <p className="text-lg font-medium text-slate-300">No subscribers yet</p>
                    <p className="text-sm text-slate-500 mt-1">Subscribers will appear here when visitors sign up via the blog</p>
                </div>
            ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-800 text-left">
                                <th className="px-5 py-3 text-xs text-slate-400 uppercase tracking-wider font-medium">Email</th>
                                <th className="px-5 py-3 text-xs text-slate-400 uppercase tracking-wider font-medium">Status</th>
                                <th className="px-5 py-3 text-xs text-slate-400 uppercase tracking-wider font-medium">Joined</th>
                                <th className="px-5 py-3 text-xs text-slate-400 uppercase tracking-wider font-medium w-16"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscribers.map((sub) => (
                                <tr key={sub._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-5 py-3.5 text-sm font-medium">{sub.email}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sub.active
                                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                            }`}>
                                            {sub.active ? 'Active' : 'Unsubscribed'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-slate-400">
                                        {new Date(sub.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric',
                                        })}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemove(sub.email)}
                                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8 w-8"
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SubscribersViewer;
