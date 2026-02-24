import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Briefcase, Mail } from 'lucide-react';
import api from '../../services/api';
import { Card, CardContent } from '../../components/ui/card';

interface StatsShape {
    projects: number;
    blogs: number;
    messages: number;
}

const Dashboard = () => {
    const [stats, setStats] = useState<StatsShape>({ projects: 0, blogs: 0, messages: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch counts concurrently
                const [projRes, blogRes, msgRes] = await Promise.all([
                    api.get('/projects'),
                    api.get('/blog'),
                    api.get('/messages')
                ]);

                setStats({
                    projects: Array.isArray(projRes?.data) ? projRes.data.length : (projRes?.data?.data?.length || 0),
                    blogs: Array.isArray(blogRes?.data) ? blogRes.data.length : (blogRes?.data?.data?.length || 0),
                    messages: Array.isArray(msgRes?.data) ? msgRes.data.filter((m: any) => !m.isRead).length : 0, // Unread messages
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { title: 'Total Projects', value: stats.projects, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
        { title: 'Published Posts', value: stats.blogs, icon: FileText, color: 'text-neonCyan', bg: 'bg-neonCyan/10', border: 'border-neonCyan/20' },
        { title: 'Unread Inquiries', value: stats.messages, icon: Mail, color: 'text-neonPurple', bg: 'bg-neonPurple/10', border: 'border-neonPurple/20' },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <Helmet>
                <title>Admin Dashboard | Shekhar Kashyap</title>
            </Helmet>

            <header className="mb-10 text-white">
                <h1 className="text-3xl font-heading font-bold text-white">Dashboard Overview</h1>
                <p className="text-gray-400 mt-2">Welcome back to your command center.</p>
            </header>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neonCyan"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {statCards.map((stat, i) => (
                        <Card key={i} className="bg-background/50 backdrop-blur-md border border-border hover:border-border/80 transition-colors">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-4 rounded-xl ${stat.bg} ${stat.border} border`}>
                                        <stat.icon className={`${stat.color} w-8 h-8`} />
                                    </div>
                                    <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">{stat.title}</span>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-5xl font-bold text-foreground font-heading">
                                        {stat.value}
                                    </h3>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
