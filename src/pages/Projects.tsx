import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import api from '../services/api';
import { ProjectCard } from '../components/ProjectCard';
import type { ProjectType } from '../components/ProjectCard';

const Projects = () => {
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/projects');
                setProjects(response.data);
            } catch (error) {
                console.error('Failed to fetch projects', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    return (
        <>
            <Helmet>
                <title>Projects - Shekhar Kashyap</title>
                <meta name="description" content="View my latest full-stack development projects, including Slay-Backend and high-performance React Native applications." />
            </Helmet>

            <div className="max-w-7xl mx-auto pt-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                        Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonCyan to-neonPurple">Projects</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        A showcase of my recent work in scalable backend systems, mobile development, and modern web applications.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neonCyan"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project, index) => (
                            <ProjectCard key={project._id} project={project} index={index} />
                        ))}
                        {projects.length === 0 && (
                            <div className="col-span-full text-center text-muted-foreground py-20">
                                No projects found. Check back later!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Projects;
