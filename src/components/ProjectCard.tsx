import { ExternalLink, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';

export interface ProjectType {
    _id: string;
    title: string;
    description: string;
    imageUrl?: string;
    githubUrl?: string;
    liveUrl?: string;
    technologies: string[];
}

export const ProjectCard = ({ project, index }: { project: ProjectType; index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="h-full"
        >
            <Card className="flex flex-col h-full overflow-hidden group bg-background/50 backdrop-blur-sm hover:border-neonCyan/50 transition-colors duration-300">
                {project.imageUrl && (
                    <div className="w-full h-48 overflow-hidden rounded-t-xl">
                        <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                )}
                <CardContent className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-heading font-bold mb-3 text-foreground group-hover:text-neonCyan transition-colors">
                        {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6 flex-grow">
                        {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.slice(0, 4).map((tech) => (
                            <span key={tech} className="text-xs font-medium px-2 py-1 rounded bg-neonCyan/10 text-neonCyan border border-neonCyan/20">
                                {tech}
                            </span>
                        ))}
                        {project.technologies.length > 4 && (
                            <span className="text-xs font-medium px-2 py-1 rounded bg-secondary text-muted-foreground">
                                +{project.technologies.length - 4} more
                            </span>
                        )}
                    </div>
                    <div className="flex gap-4 mt-auto pt-4 border-t border-border">
                        {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium transition-colors">
                                <Github size={18} /> Code
                            </a>
                        )}
                        {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-neonCyan hover:text-neonPurple flex items-center gap-2 text-sm font-medium transition-colors ml-auto">
                                Live Demo <ExternalLink size={18} />
                            </a>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};
