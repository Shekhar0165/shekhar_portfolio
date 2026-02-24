import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Github, Linkedin, Twitter } from 'lucide-react';
import api from '../services/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await api.post('/messages', formData);
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Failed to send message', error);
            setStatus('error');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="max-w-7xl mx-auto pt-8">
            <Helmet>
                <title>Contact Me | Shekhar Kashyap</title>
                <meta name="description" content="Get in touch with Shekhar Kashyap for full-stack development work, project inquiries, or simply to say hello." />
            </Helmet>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-foreground">
                    Let's Build Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonCyan to-neonPurple">Together</span>
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Whether you have a specific project in mind, need technical architecture advice, or want to discuss full-time opportunities, I'm here to help.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Information */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col gap-8"
                >
                    <Card className="bg-background/50 backdrop-blur-sm border-border">
                        <CardContent className="p-8">
                            <h2 className="text-2xl font-heading font-bold mb-6 text-foreground">Contact Information</h2>
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-4 text-muted-foreground hover:text-neonCyan transition-colors">
                                    <div className="p-3 bg-secondary rounded-lg text-neonCyan">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Email</p>
                                        <a href="mailto:hello@shekhar.dev" className="text-base">hello@shekhar.dev</a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-muted-foreground">
                                    <div className="p-3 bg-secondary rounded-lg text-neonPurple">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Location</p>
                                        <p className="text-base">Global / Remote</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-background/50 backdrop-blur-sm border-border">
                        <CardContent className="p-8">
                            <h2 className="text-2xl font-heading font-bold mb-6 text-foreground">Social Profiles</h2>
                            <div className="flex gap-4">
                                <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="p-3 bg-secondary rounded-lg text-muted-foreground hover:text-neonCyan hover:bg-neonCyan/10 transition-colors">
                                    <Github size={24} />
                                </a>
                                <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="p-3 bg-secondary rounded-lg text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 transition-colors">
                                    <Linkedin size={24} />
                                </a>
                                <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="p-3 bg-secondary rounded-lg text-muted-foreground hover:text-sky-500 hover:bg-sky-500/10 transition-colors">
                                    <Twitter size={24} />
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="bg-background/50 backdrop-blur-sm border-border">
                        <CardContent className="p-8">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex flex-col gap-2 w-full">
                                        <Label htmlFor="name">Your Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="bg-background border-border"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 w-full">
                                        <Label htmlFor="email">Your Email</Label>
                                        <Input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="bg-background border-border"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="bg-background border-border"
                                        placeholder="Discussing a new project"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        rows={6}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="bg-background border-border resize-none"
                                        placeholder="Please provide details about your inquiry..."
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full bg-gradient-to-r from-neonCyan to-neonPurple hover:opacity-90 text-white h-12 text-lg font-medium border-0"
                                >
                                    {status === 'loading' ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Sending...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            Send Message <Send size={20} />
                                        </div>
                                    )}
                                </Button>

                                {status === 'success' && (
                                    <p className="text-neonCyan text-center mt-2 font-medium">Message sent successfully! I will get back to you soon.</p>
                                )}
                                {status === 'error' && (
                                    <p className="text-red-500 text-center mt-2 font-medium">Failed to send message. Please try again later.</p>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
