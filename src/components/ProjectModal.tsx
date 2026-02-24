interface ProjectModalProps {
    project: {
        title: string;
        imageUrl?: string;
        description: string;
        stack?: string;
        githubUrl?: string;
        liveUrl?: string;
        highlights?: string[];
        technologies?: string[];
    };
    onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
    return (
        <div className="aws-modal-overlay" onClick={onClose}>
            <div className="aws-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 700 }}>
                <button className="aws-modal-close" onClick={onClose}>✕</button>

                {/* Image */}
                {project.imageUrl && (
                    <div style={{ margin: '-24px -24px 20px -24px', borderRadius: '12px 12px 0 0', overflow: 'hidden' }}>
                        <img
                            src={project.imageUrl}
                            alt={project.title}
                            style={{ width: '100%', maxHeight: 280, objectFit: 'cover' }}
                        />
                    </div>
                )}

                {/* Title */}
                <h2 style={{ color: '#FFB300', fontSize: 20, marginBottom: 8 }}>
                    📦 {project.title}
                </h2>

                {/* Stack */}
                {project.stack && (
                    <p style={{ color: '#888', fontSize: 13, marginBottom: 16 }}>
                        {project.stack}
                    </p>
                )}

                {/* Description */}
                <p style={{ color: '#e0e0e0', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
                    {project.description}
                </p>

                {/* Highlights */}
                {project.highlights && project.highlights.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                        <p style={{ color: '#FFB300', fontSize: 13, marginBottom: 8 }}>Key Highlights:</p>
                        {project.highlights.map((h, i) => (
                            <div key={i} style={{ color: '#00FF00', fontSize: 13, paddingLeft: 8, marginBottom: 4 }}>
                                → {h}
                            </div>
                        ))}
                    </div>
                )}

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                        {project.technologies.map((t, i) => (
                            <span
                                key={i}
                                style={{
                                    fontSize: 11,
                                    padding: '3px 10px',
                                    borderRadius: 20,
                                    background: '#333',
                                    color: '#ccc',
                                    border: '1px solid #444',
                                }}
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                )}

                {/* Links */}
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="term-link"
                            style={{
                                fontSize: 13,
                                padding: '6px 16px',
                                border: '1px solid #06b6d4',
                                borderRadius: 8,
                                color: '#06b6d4',
                            }}
                        >
                            GitHub →
                        </a>
                    )}
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="term-link"
                            style={{
                                fontSize: 13,
                                padding: '6px 16px',
                                border: '1px solid #00FF00',
                                borderRadius: 8,
                                color: '#00FF00',
                            }}
                        >
                            Live Demo →
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
