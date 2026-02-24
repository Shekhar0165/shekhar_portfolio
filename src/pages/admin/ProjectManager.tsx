import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit2, Trash2, Check, X, Image as ImageIcon, ExternalLink, Upload } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import api from '../../services/api';
import type { ProjectType } from '../../components/ProjectCard';

interface ProjectFormState {
    _id?: string;
    title: string;
    shortDesc: string;
    description: string;
    stack: string;
    imageUrl: string;
    githubUrl: string;
    liveUrl: string;
    technologies: string;
    highlights: string;
    featured: boolean;
}

const emptyForm: ProjectFormState = {
    title: '',
    shortDesc: '',
    description: '',
    stack: '',
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
    technologies: '',
    highlights: '',
    featured: false,
};

const ProjectManager = () => {
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState<ProjectFormState>(emptyForm);
    const [loading, setLoading] = useState(true);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProjects(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            title: formData.title,
            shortDesc: formData.shortDesc,
            description: formData.description,
            stack: formData.stack,
            imageUrl: formData.imageUrl || undefined,
            githubUrl: formData.githubUrl || undefined,
            liveUrl: formData.liveUrl || undefined,
            technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
            highlights: formData.highlights.split('\n').map(h => h.trim()).filter(Boolean),
            featured: formData.featured,
        };

        try {
            if (editId) {
                await api.patch(`/projects/${editId}`, payload);
            } else {
                await api.post('/projects', payload);
            }
            setIsEditing(false);
            setFormData(emptyForm);
            setEditId(null);
            fetchProjects();
        } catch (error) {
            console.error(error);
            alert('Failed to save project');
        }
    };

    const handleEdit = (project: ProjectType) => {
        setEditId(project._id);
        setFormData({
            _id: project._id,
            title: project.title,
            shortDesc: (project as any).shortDesc || '',
            description: project.description,
            stack: (project as any).stack || '',
            imageUrl: project.imageUrl || '',
            githubUrl: project.githubUrl || '',
            liveUrl: project.liveUrl || '',
            technologies: project.technologies.join(', '),
            highlights: (project as any).highlights?.join('\n') || '',
            featured: (project as any).featured || false,
        });
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                await api.delete(`/projects/${id}`);
                fetchProjects();
            } catch (error) {
                console.error(error);
                alert('Failed to delete project');
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <Helmet>
                <title>Project Manager | Shekhar Kashyap</title>
            </Helmet>

            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white">Projects</h1>
                    <p className="text-gray-400 mt-2">Manage your portfolio projects. These appear in the terminal.</p>
                </div>
                <Button
                    onClick={() => { setEditId(null); setFormData(emptyForm); setIsEditing(true); }}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 text-white border-0 shadow-lg shadow-cyan-500/20"
                >
                    <Plus size={20} className="mr-2" /> New Project
                </Button>
            </header>

            {/* Form */}
            {isEditing && (
                <div className="mb-10 p-8 bg-slate-800/50 border border-slate-700 rounded-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-heading font-bold text-white">
                            {editId ? '✏️ Edit Project' : '🆕 Create New Project'}
                        </h2>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Row 1: Title + Short Description */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <Label className="text-gray-300">Title *</Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="bg-slate-900 border-slate-600 text-white focus:border-cyan-400"
                                    placeholder="e.g. Slay Backend"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="text-gray-300">Short Description</Label>
                                <Input
                                    value={formData.shortDesc}
                                    onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                                    className="bg-slate-900 border-slate-600 text-white focus:border-cyan-400"
                                    placeholder="One-line summary for terminal table"
                                />
                            </div>
                        </div>

                        {/* Row 2: Stack + Image URL */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <Label className="text-gray-300">Tech Stack</Label>
                                <Input
                                    value={formData.stack}
                                    onChange={(e) => setFormData({ ...formData, stack: e.target.value })}
                                    className="bg-slate-900 border-slate-600 text-white focus:border-cyan-400"
                                    placeholder="NestJS + PostgreSQL + Redis + AWS"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="text-gray-300">Image</Label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        type="text"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        className="bg-slate-900 border-slate-600 text-white focus:border-cyan-400 flex-1"
                                        placeholder="URL or upload an image →"
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        id="project-image-upload"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            try {
                                                const fd = new FormData();
                                                fd.append('file', file);
                                                const res = await api.post('/upload/image', fd, {
                                                    headers: { 'Content-Type': 'multipart/form-data' },
                                                });
                                                setFormData((prev) => ({ ...prev, imageUrl: res.data.url }));
                                            } catch (err) {
                                                console.error(err);
                                                alert('Failed to upload image');
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => document.getElementById('project-image-upload')?.click()}
                                        className="border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 shrink-0"
                                    >
                                        <Upload size={16} className="mr-2" /> Upload
                                    </Button>
                                </div>
                                {formData.imageUrl && (
                                    <img src={formData.imageUrl} alt="Preview" className="mt-2 rounded-lg max-h-32 object-cover border border-slate-700" />
                                )}
                            </div>
                        </div>

                        {/* Row 3: GitHub + Live URL  */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <Label className="text-gray-300">GitHub URL</Label>
                                <Input
                                    type="url"
                                    value={formData.githubUrl}
                                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                    className="bg-slate-900 border-slate-600 text-white focus:border-cyan-400"
                                    placeholder="https://github.com/..."
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="text-gray-300">Live Demo URL</Label>
                                <Input
                                    type="url"
                                    value={formData.liveUrl}
                                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                                    className="bg-slate-900 border-slate-600 text-white focus:border-cyan-400"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-gray-300">Description *</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="bg-slate-900 border-slate-600 text-white resize-none focus:border-cyan-400"
                                placeholder="Detailed project description..."
                                required
                            />
                        </div>

                        {/* Technologies */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-gray-300">Technologies (comma separated) *</Label>
                            <Input
                                value={formData.technologies}
                                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                                className="bg-slate-900 border-slate-600 text-white focus:border-cyan-400"
                                placeholder="React, NestJS, MongoDB, AWS"
                                required
                            />
                        </div>

                        {/* Highlights */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-gray-300">Key Highlights (one per line)</Label>
                            <Textarea
                                value={formData.highlights}
                                onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                                rows={4}
                                className="bg-slate-900 border-slate-600 text-white resize-none focus:border-cyan-400"
                                placeholder={"Handles 10K+ concurrent users\nHLS video transcoding pipeline\nReal-time chat via Socket.IO"}
                            />
                        </div>

                        {/* Featured Toggle */}
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-600 rounded-full peer-checked:bg-cyan-500 transition-colors" />
                                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                            </div>
                            <span className="text-gray-300 group-hover:text-white transition-colors">Featured Project</span>
                        </label>

                        {/* Image Preview */}
                        {formData.imageUrl && (
                            <div className="rounded-xl overflow-hidden border border-slate-700">
                                <div className="px-4 py-2 bg-slate-700/50 text-xs text-gray-400 flex items-center gap-2">
                                    <ImageIcon size={14} />
                                    Image Preview
                                </div>
                                <img
                                    src={formData.imageUrl}
                                    alt="Preview"
                                    className="w-full max-h-64 object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                                className="border-slate-600 text-gray-300 hover:bg-slate-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 text-white border-0"
                            >
                                <Check size={20} className="mr-2" /> Save Project
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Projects Table */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400" />
                </div>
            ) : (
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-700 bg-slate-800/50">
                                <th className="p-4 font-medium text-gray-400 text-sm uppercase tracking-wider">Project</th>
                                <th className="p-4 font-medium text-gray-400 text-sm uppercase tracking-wider hidden md:table-cell">Tech Stack</th>
                                <th className="p-4 font-medium text-gray-400 text-sm uppercase tracking-wider text-center">Status</th>
                                <th className="p-4 font-medium text-gray-400 text-sm uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project._id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            {project.imageUrl ? (
                                                <img
                                                    src={project.imageUrl}
                                                    alt={project.title}
                                                    className="w-12 h-12 rounded-lg object-cover border border-slate-600"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-slate-700 border border-slate-600 flex items-center justify-center">
                                                    <ImageIcon size={18} className="text-slate-500" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-bold text-white mb-0.5">{project.title}</div>
                                                <div className="text-xs text-gray-500 truncate max-w-xs">
                                                    {(project as any).shortDesc || project.description}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 hidden md:table-cell">
                                        <div className="flex flex-wrap gap-1">
                                            {project.technologies.slice(0, 4).map((t, i) => (
                                                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-gray-300 border border-slate-600">{t}</span>
                                            ))}
                                            {project.technologies.length > 4 && (
                                                <span className="text-xs px-2 py-0.5 text-gray-500">+{project.technologies.length - 4}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        {(project as any).featured ? (
                                            <span className="inline-flex py-1 px-3 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20">
                                                ⭐ Featured
                                            </span>
                                        ) : (
                                            <span className="text-gray-600 text-xs">—</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            {project.liveUrl && (
                                                <a
                                                    href={project.liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-lg border border-slate-600 text-gray-400 hover:bg-slate-700 hover:text-white transition-colors"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            )}
                                            <button
                                                onClick={() => handleEdit(project)}
                                                className="p-2 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project._id)}
                                                className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {projects.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <ImageIcon size={40} className="text-slate-600" />
                                            <p>No projects yet. Create your first one!</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProjectManager;
