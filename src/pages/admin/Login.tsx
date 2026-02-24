import { useState } from 'react';

import { Helmet } from 'react-helmet-async';
import { Lock } from 'lucide-react';
import api from '../../services/api';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', { username, password });
            const { access_token } = response.data;
            if (access_token) {
                localStorage.setItem('admin_token', access_token);
                // The api.ts interceptor will now automatically attach this token
                window.location.href = '/admin/dashboard'; // full reload to reset states
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden">
            <Helmet>
                <title>Admin Login | Shekhar Kashyap</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Background Blobs for specific glowing aesthetics */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neonCyan/10 rounded-full mix-blend-screen blur-[128px] animate-blob pointer-events-none" />

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-secondary/50 rounded-full mb-4 border border-border backdrop-blur-md">
                        <Lock className="text-neonCyan w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-foreground">Admin Access</h1>
                    <p className="text-muted-foreground mt-2">Restricted Portal</p>
                </div>

                <Card className="bg-background/80 backdrop-blur-xl border-border shadow-2xl">
                    <CardContent className="p-8">
                        {error && (
                            <div className="p-3 mb-6 bg-red-500/10 border border-red-500/50 text-red-500 rounded text-sm text-center font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="bg-secondary/50 border-border text-foreground"
                                    required
                                    autoComplete="username"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-secondary/50 border-border text-foreground"
                                    required
                                    autoComplete="current-password"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-neonCyan to-neonPurple hover:opacity-90 transition-opacity text-white h-12 font-medium border-0 mt-2"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2 text-white">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Authenticating...
                                    </div>
                                ) : 'Secure Login'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;
