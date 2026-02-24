import { Link } from 'react-router-dom';
import { Menu, X, Terminal } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 text-xl font-heading font-bold text-foreground">
                    <Terminal className="text-neonCyan" size={28} />
                    <span>Shekhar<span className="text-neonPurple">.dev</span></span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8 font-medium">
                    <Link to="/projects" className="text-muted-foreground hover:text-foreground transition-colors">Projects</Link>
                    <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
                    <Button asChild className="bg-gradient-to-r from-neonCyan to-neonPurple hover:opacity-90 transition-opacity text-white border-0">
                        <Link to="/contact">Contact Me</Link>
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border p-4 flex flex-col gap-4 shadow-lg">
                    <Link to="/projects" className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1" onClick={() => setIsOpen(false)}>Projects</Link>
                    <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1" onClick={() => setIsOpen(false)}>Blog</Link>
                    <Button asChild className="w-full bg-gradient-to-r from-neonCyan to-neonPurple hover:opacity-90 text-white" onClick={() => setIsOpen(false)}>
                        <Link to="/contact">Contact Me</Link>
                    </Button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
