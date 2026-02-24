import { motion } from 'framer-motion';
import { ArrowRight, Code2, Database, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';

const Hero = () => {
    return (
        <section className="min-h-[80vh] flex flex-col justify-center items-center text-center relative pt-10">
            {/* Background Blobs for specific glowing aesthetics */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-neonCyan rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-blob pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-neonPurple rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-blob animation-delay-2000 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 max-w-3xl"
            >
                <span className="inline-block py-1 px-3 rounded-full border border-border bg-secondary/50 backdrop-blur-sm text-neonCyan text-sm font-medium mb-6">
                    Full-Stack Developer & Engineer
                </span>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground tracking-tight">
                    Building Digital <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonCyan to-neonPurple">
                        Experiences
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                    I specialize in <strong>NestJS</strong>, <strong>React Native</strong>, and scalable cloud architectures. Turning complex problems into elegant, high-performance applications.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild size="lg" className="bg-gradient-to-r from-neonCyan to-neonPurple hover:opacity-90 transition-opacity w-full sm:w-auto h-12 px-8 text-base">
                        <Link to="/projects">
                            View My Work <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 bg-transparent border-border hover:bg-secondary/80 text-base">
                        <Link to="/blog">
                            Read My Blog
                        </Link>
                    </Button>
                </div>
            </motion.div>

            {/* Tech Stack Bubbles using shadcn Card component */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 z-10 w-full max-w-4xl"
            >
                <Card className="flex items-center gap-4 p-4 bg-background/50 backdrop-blur-sm border-border hover:bg-secondary/20 transition-colors">
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg"><Layout size={24} /></div>
                    <div className="text-left">
                        <h3 className="font-bold text-foreground">Frontend</h3>
                        <p className="text-sm text-muted-foreground">React, Next.js, React Native</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 p-4 bg-background/50 backdrop-blur-sm border-border hover:bg-secondary/20 transition-colors">
                    <div className="p-3 bg-red-500/10 text-red-400 rounded-lg"><Database size={24} /></div>
                    <div className="text-left">
                        <h3 className="font-bold text-foreground">Backend</h3>
                        <p className="text-sm text-muted-foreground">NestJS, Node, MongoDB, SQL</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 p-4 bg-background/50 backdrop-blur-sm border-border hover:bg-secondary/20 transition-colors">
                    <div className="p-3 bg-orange-500/10 text-orange-400 rounded-lg"><Code2 size={24} /></div>
                    <div className="text-left">
                        <h3 className="font-bold text-foreground">Infrastructure</h3>
                        <p className="text-sm text-muted-foreground">Docker, AWS (S3, ECS, SQS)</p>
                    </div>
                </Card>
            </motion.div>
        </section>
    );
};

export default Hero;
