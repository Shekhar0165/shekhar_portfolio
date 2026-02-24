import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Save, Plus, Trash2, User, Briefcase, GraduationCap, Code, BookOpen, Zap } from 'lucide-react';
import api from '../../services/api';

/* ── Types matching backend schema ── */
interface ExtraField { label: string; value: string; link: string; }
interface PersonalInfo {
    name: string; handle: string; role: string; company: string; since: string;
    status: string; interests: string; location: string; tagline: string;
    email: string; linkedin: string; github: string; twitter: string; pageTitle: string;
    extraFields: ExtraField[];
}
interface ExperienceEntry { period: string; role: string; company: string; bullets: string[]; }
interface SkillItem { name: string; level: number; }
interface SkillCategory { category: string; items: SkillItem[]; }
interface EducationInfo { degree: string; college: string; year: string; cgpa: string; courses: string[]; }
interface BlogEntry { title: string; url: string; }
interface TerminalConfig {
    personal: PersonalInfo;
    experience: ExperienceEntry[];
    skills: SkillCategory[];
    education: EducationInfo;
    blogs: BlogEntry[];
    sudoLines: string[];
}

const TABS = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'blogs', label: 'Blogs', icon: BookOpen },
    { id: 'sudo', label: 'Sudo', icon: Zap },
];

const emptyPersonal: PersonalInfo = {
    name: '', handle: '', role: '', company: '', since: '', status: '',
    interests: '', location: '', tagline: '', email: '', linkedin: '',
    github: '', twitter: '', pageTitle: '', extraFields: [],
};

const TerminalConfigManager = () => {
    const [config, setConfig] = useState<TerminalConfig>({
        personal: { ...emptyPersonal },
        experience: [],
        skills: [],
        education: { degree: '', college: '', year: '', cgpa: '', courses: [] },
        blogs: [],
        sudoLines: [],
    });
    const [tab, setTab] = useState('personal');
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/terminal-config').then((r) => {
            setConfig(r.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const save = async () => {
        setSaving(true);
        setMsg('');
        try {
            await api.put('/terminal-config', config);
            setMsg('✅ Saved!');
            setTimeout(() => setMsg(''), 3000);
        } catch {
            setMsg('❌ Failed to save');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400" />
        </div>
    );

    /* ── Input helpers ── */
    const inputCls = "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors";
    const labelCls = "block text-xs text-slate-400 mb-1 font-medium";
    const sectionTitle = (t: string) => <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-2">{t}</h3>;

    /* ── Updaters ── */
    const setPersonal = (key: keyof PersonalInfo, val: string) =>
        setConfig((c) => ({ ...c, personal: { ...c.personal, [key]: val } }));

    const setEdu = (key: keyof EducationInfo, val: any) =>
        setConfig((c) => ({ ...c, education: { ...c.education, [key]: val } }));

    return (
        <div className="max-w-5xl mx-auto">
            <Helmet><title>Terminal Content | Admin</title></Helmet>

            <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Terminal Content</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage all terminal commands from here</p>
                </div>
                <div className="flex items-center gap-3">
                    {msg && <span className="text-sm">{msg}</span>}
                    <button onClick={save} disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                        <Save size={16} /> {saving ? 'Saving...' : 'Save All'}
                    </button>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex flex-wrap gap-1 mb-6 bg-slate-800/50 p-1 rounded-lg">
                {TABS.map((t) => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${tab === t.id ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                        <t.icon size={14} /> <span className="hidden sm:inline">{t.label}</span>
                    </button>
                ))}
            </div>

            {tab === 'personal' && (
                <div className="space-y-4">
                    {sectionTitle('Personal Info (whoami & contact)')}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {([
                            ['name', 'Full Name'], ['handle', 'Handle (username)'], ['role', 'Current Role'], ['company', 'Company'],
                            ['since', 'Working Since'], ['status', 'Status'], ['interests', 'Interests'], ['location', 'Location'],
                            ['email', 'Email'], ['linkedin', 'LinkedIn URL'], ['github', 'GitHub URL'], ['twitter', 'Twitter Handle'],
                            ['tagline', 'Tagline'], ['pageTitle', 'Page Title (SEO)'],
                        ] as [keyof PersonalInfo, string][]).map(([key, label]) => (
                            <div key={key}>
                                <label className={labelCls}>{label}</label>
                                <input className={inputCls} value={config.personal[key] as string}
                                    onChange={(e) => setPersonal(key, e.target.value)} />
                            </div>
                        ))}
                    </div>

                    {/* ── Extra Custom Fields ── */}
                    <div className="mt-6">
                        <h4 className="text-sm font-bold text-slate-300 mb-3">Custom Fields</h4>
                        <p className="text-xs text-slate-500 mb-3">Add extra fields that appear in your "whoami" output. Optionally add a link to make them clickable.</p>
                        {(config.personal.extraFields || []).map((ef, i) => (
                            <div key={i} className="flex items-center gap-2 mb-2">
                                <input className={inputCls + ' w-32'} placeholder="Label" value={ef.label}
                                    onChange={(e) => {
                                        const upd = [...(config.personal.extraFields || [])]; upd[i] = { ...upd[i], label: e.target.value };
                                        setConfig((c) => ({ ...c, personal: { ...c.personal, extraFields: upd } }));
                                    }} />
                                <input className={inputCls + ' flex-1'} placeholder="Value" value={ef.value}
                                    onChange={(e) => {
                                        const upd = [...(config.personal.extraFields || [])]; upd[i] = { ...upd[i], value: e.target.value };
                                        setConfig((c) => ({ ...c, personal: { ...c.personal, extraFields: upd } }));
                                    }} />
                                <input className={inputCls + ' flex-1'} placeholder="Link (optional)" value={ef.link}
                                    onChange={(e) => {
                                        const upd = [...(config.personal.extraFields || [])]; upd[i] = { ...upd[i], link: e.target.value };
                                        setConfig((c) => ({ ...c, personal: { ...c.personal, extraFields: upd } }));
                                    }} />
                                <button onClick={() => {
                                    const upd = (config.personal.extraFields || []).filter((_, j) => j !== i);
                                    setConfig((c) => ({ ...c, personal: { ...c.personal, extraFields: upd } }));
                                }} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                            </div>
                        ))}
                        <button onClick={() => {
                            const upd = [...(config.personal.extraFields || []), { label: '', value: '', link: '' }];
                            setConfig((c) => ({ ...c, personal: { ...c.personal, extraFields: upd } }));
                        }}
                            className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-600 rounded-lg text-sm text-slate-400 hover:text-white hover:border-cyan-500 transition-colors">
                            <Plus size={14} /> Add Field
                        </button>
                    </div>
                </div>
            )}

            {/* ═══════ EXPERIENCE ═══════ */}
            {tab === 'experience' && (
                <div className="space-y-4">
                    {sectionTitle('Experience')}
                    {config.experience.map((exp, i) => (
                        <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <span className="text-sm text-slate-400">Entry #{i + 1}</span>
                                <button onClick={() => setConfig((c) => ({ ...c, experience: c.experience.filter((_, j) => j !== i) }))}
                                    className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div><label className={labelCls}>Period</label>
                                    <input className={inputCls} value={exp.period} onChange={(e) => {
                                        const upd = [...config.experience]; upd[i] = { ...upd[i], period: e.target.value }; setConfig((c) => ({ ...c, experience: upd }));
                                    }} /></div>
                                <div><label className={labelCls}>Role</label>
                                    <input className={inputCls} value={exp.role} onChange={(e) => {
                                        const upd = [...config.experience]; upd[i] = { ...upd[i], role: e.target.value }; setConfig((c) => ({ ...c, experience: upd }));
                                    }} /></div>
                                <div><label className={labelCls}>Company</label>
                                    <input className={inputCls} value={exp.company} onChange={(e) => {
                                        const upd = [...config.experience]; upd[i] = { ...upd[i], company: e.target.value }; setConfig((c) => ({ ...c, experience: upd }));
                                    }} /></div>
                            </div>
                            <div>
                                <label className={labelCls}>Bullets (one per line)</label>
                                <textarea className={inputCls + " min-h-[80px]"} value={exp.bullets.join('\n')}
                                    onChange={(e) => {
                                        const upd = [...config.experience]; upd[i] = { ...upd[i], bullets: e.target.value.split('\n') }; setConfig((c) => ({ ...c, experience: upd }));
                                    }} />
                            </div>
                        </div>
                    ))}
                    <button onClick={() => setConfig((c) => ({ ...c, experience: [...c.experience, { period: '', role: '', company: '', bullets: [] }] }))}
                        className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-600 rounded-lg text-sm text-slate-400 hover:text-white hover:border-cyan-500 transition-colors">
                        <Plus size={14} /> Add Experience
                    </button>
                </div>
            )}

            {/* ═══════ SKILLS ═══════ */}
            {tab === 'skills' && (
                <div className="space-y-4">
                    {sectionTitle('Skills')}
                    {config.skills.map((cat, ci) => (
                        <div key={ci} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <div className="flex-1 mr-3">
                                    <label className={labelCls}>Category</label>
                                    <input className={inputCls} value={cat.category} onChange={(e) => {
                                        const upd = [...config.skills]; upd[ci] = { ...upd[ci], category: e.target.value }; setConfig((c) => ({ ...c, skills: upd }));
                                    }} />
                                </div>
                                <button onClick={() => setConfig((c) => ({ ...c, skills: c.skills.filter((_, j) => j !== ci) }))}
                                    className="text-red-400 hover:text-red-300 mt-5"><Trash2 size={16} /></button>
                            </div>
                            {cat.items.map((item, ii) => (
                                <div key={ii} className="flex items-center gap-3">
                                    <input className={inputCls + " flex-1"} placeholder="Skill name" value={item.name}
                                        onChange={(e) => {
                                            const upd = [...config.skills]; const items = [...upd[ci].items]; items[ii] = { ...items[ii], name: e.target.value }; upd[ci] = { ...upd[ci], items }; setConfig((c) => ({ ...c, skills: upd }));
                                        }} />
                                    <input type="number" min="0" max="100" className={inputCls + " w-20"} value={item.level}
                                        onChange={(e) => {
                                            const upd = [...config.skills]; const items = [...upd[ci].items]; items[ii] = { ...items[ii], level: parseInt(e.target.value) || 0 }; upd[ci] = { ...upd[ci], items }; setConfig((c) => ({ ...c, skills: upd }));
                                        }} />
                                    <button onClick={() => {
                                        const upd = [...config.skills]; upd[ci] = { ...upd[ci], items: upd[ci].items.filter((_, j) => j !== ii) }; setConfig((c) => ({ ...c, skills: upd }));
                                    }} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                                </div>
                            ))}
                            <button onClick={() => {
                                const upd = [...config.skills]; upd[ci] = { ...upd[ci], items: [...upd[ci].items, { name: '', level: 50 }] }; setConfig((c) => ({ ...c, skills: upd }));
                            }} className="text-xs text-slate-400 hover:text-cyan-400"><Plus size={12} className="inline mr-1" />Add Skill</button>
                        </div>
                    ))}
                    <button onClick={() => setConfig((c) => ({ ...c, skills: [...c.skills, { category: '', items: [] }] }))}
                        className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-600 rounded-lg text-sm text-slate-400 hover:text-white hover:border-cyan-500 transition-colors">
                        <Plus size={14} /> Add Category
                    </button>
                </div>
            )}

            {/* ═══════ EDUCATION ═══════ */}
            {tab === 'education' && (
                <div className="space-y-4">
                    {sectionTitle('Education')}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label className={labelCls}>Degree</label><input className={inputCls} value={config.education.degree} onChange={(e) => setEdu('degree', e.target.value)} /></div>
                        <div><label className={labelCls}>College</label><input className={inputCls} value={config.education.college} onChange={(e) => setEdu('college', e.target.value)} /></div>
                        <div><label className={labelCls}>Year</label><input className={inputCls} value={config.education.year} onChange={(e) => setEdu('year', e.target.value)} /></div>
                        <div><label className={labelCls}>CGPA</label><input className={inputCls} value={config.education.cgpa} onChange={(e) => setEdu('cgpa', e.target.value)} /></div>
                    </div>
                    <div>
                        <label className={labelCls}>Courses (one per line)</label>
                        <textarea className={inputCls + " min-h-[100px]"} value={config.education.courses.join('\n')}
                            onChange={(e) => setEdu('courses', e.target.value.split('\n'))} />
                    </div>
                </div>
            )}

            {/* ═══════ BLOGS ═══════ */}
            {tab === 'blogs' && (
                <div className="space-y-4">
                    {sectionTitle('Blog Links')}
                    <p className="text-xs text-slate-500 -mt-2 mb-4">Add blog posts with titles and URLs. Users type "blogs" in terminal and click to visit.</p>
                    {config.blogs.map((b, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <input className={inputCls + " flex-1"} placeholder="Blog Title" value={b.title}
                                onChange={(e) => {
                                    const upd = [...config.blogs]; upd[i] = { ...upd[i], title: e.target.value }; setConfig((c) => ({ ...c, blogs: upd }));
                                }} />
                            <input className={inputCls + " flex-1"} placeholder="https://..." value={b.url}
                                onChange={(e) => {
                                    const upd = [...config.blogs]; upd[i] = { ...upd[i], url: e.target.value }; setConfig((c) => ({ ...c, blogs: upd }));
                                }} />
                            <button onClick={() => setConfig((c) => ({ ...c, blogs: c.blogs.filter((_, j) => j !== i) }))}
                                className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                        </div>
                    ))}
                    <button onClick={() => setConfig((c) => ({ ...c, blogs: [...c.blogs, { title: '', url: '' }] }))}
                        className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-600 rounded-lg text-sm text-slate-400 hover:text-white hover:border-cyan-500 transition-colors">
                        <Plus size={14} /> Add Blog
                    </button>
                </div>
            )}

            {/* ═══════ SUDO ═══════ */}
            {tab === 'sudo' && (
                <div className="space-y-4">
                    {sectionTitle('Sudo Hire Me (Easter Egg)')}
                    <p className="text-xs text-slate-500 -mt-2 mb-4">What shows when a visitor types "sudo hire me"? One line per entry.</p>
                    <textarea className={inputCls + " min-h-[150px]"} value={config.sudoLines.join('\n')}
                        onChange={(e) => setConfig((c) => ({ ...c, sudoLines: e.target.value.split('\n') }))} />
                </div>
            )}
        </div>
    );
};

export default TerminalConfigManager;
