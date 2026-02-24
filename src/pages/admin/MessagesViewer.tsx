import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trash2, Mail, User, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import api from '../../services/api';
import { motion } from 'framer-motion';

interface MessageType {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean; // Changed from 'read' to 'isRead'
    createdAt: string;
}

const MessagesViewer = () => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [loading, setLoading] = useState(true); // Added loading state

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await api.get('/messages');
            setMessages(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await api.patch(`/messages/${id}`, { isRead: true }); // Changed 'read' to 'isRead'
            fetchMessages();
        } catch (error) {
            console.error(error);
        }
    };

    const deleteMessage = async (id: string) => { // Renamed from handleDelete
        if (confirm('Are you sure you want to delete this message?')) {
            try {
                await api.delete(`/messages/${id}`);
                fetchMessages();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <Helmet>
                <title>Messages Inbox | Shekhar Kashyap</title>
            </Helmet>

            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-foreground">Inbox</h1>
                    <p className="text-muted-foreground mt-2">Manage inquiries from your contact form.</p>
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neonCyan"></div>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {messages.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground bg-secondary/20 rounded-xl border border-border">
                            Your inbox is empty.
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <motion.div
                                key={msg._id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`group p-6 rounded-xl border transition-all ${!msg.isRead ? 'bg-secondary/40 border-neonCyan/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-background/50 border-border hover:border-border/80'}`}
                            >
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {!msg.isRead && (
                                                <span className="w-2 h-2 rounded-full bg-neonCyan shrink-0"></span>
                                            )}
                                            <h3 className={`text-xl font-bold ${!msg.isRead ? 'text-foreground font-heading' : 'text-foreground/80'}`}>
                                                {msg.subject}
                                            </h3>
                                        </div>
                                        <div className="text-sm text-muted-foreground mb-4 flex flex-wrap gap-4">
                                            <span className="flex items-center gap-1 font-medium text-foreground"><User size={14} className="text-neonCyan" /> {msg.name}</span>
                                            <span className="flex items-center gap-1 font-medium text-foreground"><Mail size={14} className="text-neonPurple" /> {msg.email}</span>
                                            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(msg.createdAt).toLocaleString()}</span>
                                        </div>
                                        <div className="p-4 bg-background/80 rounded-lg text-foreground/90 whitespace-pre-wrap text-sm border border-border/50">
                                            {msg.message}
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col gap-2 shrink-0 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!msg.isRead && (
                                            <Button
                                                variant="outline"
                                                onClick={() => markAsRead(msg._id)}
                                                className="border-neonCyan text-neonCyan hover:bg-neonCyan/10 w-full"
                                            >
                                                <CheckCircle size={18} className="mr-2" /> Mark Read
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            onClick={() => deleteMessage(msg._id)}
                                            className="border-red-500 text-red-500 hover:bg-red-500/10 w-full"
                                        >
                                            <Trash2 size={18} className="mr-2" /> Delete
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default MessagesViewer;
