import { useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, FileText, Briefcase, Mail, Menu, X, FileUp, Terminal, Tag, Users } from 'lucide-react';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Check auth
    const token = localStorage.getItem('admin_token');
    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Terminal Content', href: '/admin/terminal', icon: Terminal },
        { name: 'Projects', href: '/admin/projects', icon: Briefcase },
        { name: 'Blog Manager', href: '/admin/blog', icon: FileText },
        { name: 'Messages', href: '/admin/messages', icon: Mail },
        { name: 'Resume', href: '/admin/resume', icon: FileUp },
        { name: 'Categories', href: '/admin/categories', icon: Tag },
        { name: 'Subscribers', href: '/admin/subscribers', icon: Users },
    ];

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
    };

    return (
        <div className="h-screen bg-slate-950 text-slate-200 flex overflow-hidden">
            {/* Mobile Sidebar Toggle */}
            <button
                className="md:hidden fixed top-3 right-3 z-50 p-2.5 bg-slate-800 rounded-lg text-white border border-slate-700 shadow-lg"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar */}
            <aside className={`
                fixed md:static top-0 left-0 z-40
                w-64 h-full flex-shrink-0
                bg-slate-950 border-r border-slate-800
                transform transition-transform duration-300 ease-in-out
                md:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-full flex flex-col overflow-y-auto">
                    {/* Logo */}
                    <div className="px-6 py-6 border-b border-slate-800">
                        <Link to="/" className="text-xl font-bold flex items-center gap-1 text-white hover:opacity-80 transition-opacity">
                            Shekhar<span className="text-cyan-400">.dev</span>
                        </Link>
                        <p className="text-[10px] text-slate-500 mt-1 tracking-[0.2em] uppercase">Admin Panel</p>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 px-3 py-4 space-y-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                                        ${isActive
                                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                            : 'text-slate-400 hover:bg-slate-800/60 hover:text-white border border-transparent'
                                        }
                                    `}
                                >
                                    <item.icon size={18} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-3 border-t border-slate-800">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
                        >
                            <LogOut size={18} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content — scrollable */}
            <main className="flex-1 min-w-0 overflow-y-auto admin-scrollbar">
                <div className="p-4 md:p-6 lg:p-8 pt-16 md:pt-6 w-full max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminLayout;
