import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Upload, Download, FileText, Check, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const ResumeManager = () => {
    const [stats, setStats] = useState<{ downloads: number; uploaded: boolean }>({ downloads: 0, uploaded: false });
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const fetchStats = async () => {
        try {
            const res = await api.get('/resume/stats');
            setStats(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => { fetchStats(); }, []);

    const handleUpload = async (file: File) => {
        if (file.type !== 'application/pdf') {
            setMessage({ type: 'error', text: 'Only PDF files are allowed' });
            return;
        }

        setUploading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/resume/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage({ type: 'success', text: res.data.message });
            fetchStats();
        } catch (e: any) {
            setMessage({ type: 'error', text: e.response?.data?.message || 'Upload failed' });
        } finally {
            setUploading(false);
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleUpload(file);
    };

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Helmet>
                <title>Resume Manager | Shekhar Kashyap</title>
            </Helmet>

            <header className="mb-10">
                <h1 className="text-3xl font-heading font-bold text-white">Resume Manager</h1>
                <p className="text-gray-400 mt-2">Upload and manage your resume PDF.</p>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <FileText className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Status</p>
                        <p className="text-lg font-bold text-white">
                            {stats.uploaded ? '✅ Uploaded' : '⚠️ Not uploaded'}
                        </p>
                    </div>
                </div>
                <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <Download className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Downloads</p>
                        <p className="text-lg font-bold text-white">{stats.downloads}</p>
                    </div>
                </div>
            </div>

            {/* Upload Zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                className={`
                    p-12 border-2 border-dashed rounded-xl text-center cursor-pointer
                    transition-all duration-300
                    ${dragOver
                        ? 'border-cyan-400 bg-cyan-400/5 scale-[1.01]'
                        : 'border-slate-600 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50'
                    }
                `}
            >
                <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf"
                    onChange={onFileSelect}
                    className="hidden"
                />

                <Upload className={`w-12 h-12 mx-auto mb-4 ${dragOver ? 'text-cyan-400' : 'text-slate-500'}`} />

                {uploading ? (
                    <div className="flex items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-400" />
                        <span className="text-gray-300">Uploading...</span>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-300 font-medium mb-1">
                            Drop your resume PDF here or click to browse
                        </p>
                        <p className="text-sm text-gray-500">Only .pdf files accepted</p>
                    </>
                )}
            </div>

            {/* Message */}
            {message && (
                <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`}>
                    {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default ResumeManager;
