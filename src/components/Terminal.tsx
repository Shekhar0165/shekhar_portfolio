import { useState, useRef, useEffect, useCallback } from 'react';
import { processCommand } from '../commands';
import type { OutputEntry, DynamicProject, TerminalConfig } from '../commands';
import BootSequence from './BootSequence';
import CommandInput from './CommandInput';
import OutputLine from './OutputLine';
import ProjectModal from './ProjectModal';
import ContactModal from './ContactModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface HistoryBlock {
    command?: string;
    output: OutputEntry[];
}

const QUICK_CMDS = ['help', 'whoami', 'experience', 'projects', 'skills', 'education', 'blogs', 'contact', 'resume'];

const defaultConfig: TerminalConfig = {
    personal: {
        name: 'Loading...', handle: 'portfolio', role: '', company: '', since: '',
        status: '', interests: '', location: '', tagline: '', email: '',
        linkedin: '', github: '', twitter: '', pageTitle: '',
    },
    experience: [], skills: [], education: { degree: '', college: '', year: '', cgpa: '', courses: [] },
    blogs: [], sudoLines: [],
};

const Terminal = () => {
    const [booting, setBooting] = useState(true);
    const [history, setHistory] = useState<HistoryBlock[]>([]);
    const [projectModal, setProjectModal] = useState<DynamicProject | null>(null);
    const [showContactModal, setShowContactModal] = useState(false);
    const [typing, setTyping] = useState(false);
    const [dynamicProjects, setDynamicProjects] = useState<DynamicProject[]>([]);
    const [termConfig, setTermConfig] = useState<TerminalConfig>(defaultConfig);
    const bodyRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch terminal config + projects from API
    useEffect(() => {
        fetch(`${API_URL}/terminal-config`)
            .then((r) => r.json())
            .then((data) => setTermConfig(data))
            .catch(() => console.warn('Could not fetch terminal config'));

        fetch(`${API_URL}/projects`)
            .then((r) => r.json())
            .then((data) => setDynamicProjects(data))
            .catch(() => console.warn('Could not fetch projects from API'));
    }, []);

    const scrollToBottom = useCallback(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [history, scrollToBottom]);

    const focusInput = () => {
        const input = containerRef.current?.querySelector<HTMLInputElement>('.command-input');
        input?.focus();
    };

    const typewriterOutput = useCallback(
        (command: string, entries: OutputEntry[], opts?: { openProject?: DynamicProject; openContact?: boolean }) => {
            setTyping(true);

            setHistory((prev) => [
                ...prev,
                { command, output: [] },
            ]);

            let idx = 0;
            const interval = setInterval(() => {
                if (idx < entries.length) {
                    const entry = entries[idx];
                    idx++;
                    setHistory((prev) => {
                        const updated = [...prev];
                        const last = updated[updated.length - 1];
                        updated[updated.length - 1] = {
                            ...last,
                            output: [...last.output, entry],
                        };
                        return updated;
                    });
                } else {
                    clearInterval(interval);
                    setTyping(false);
                    if (opts?.openProject) {
                        setTimeout(() => setProjectModal(opts.openProject!), 300);
                    }
                    if (opts?.openContact) {
                        setTimeout(() => setShowContactModal(true), 400);
                    }
                }
            }, 20);
        },
        []
    );

    const handleCommand = useCallback(
        (raw: string) => {
            const input = raw.trim().toLowerCase();

            if (input === 'clear') {
                setHistory([]);
                return;
            }

            const result = processCommand(raw, dynamicProjects, termConfig);
            typewriterOutput(raw, result.output, {
                openProject: result.openProjectModal,
                openContact: result.openContactModal,
            });
        },
        [typewriterOutput, dynamicProjects, termConfig]
    );

    const handleBootComplete = useCallback(() => {
        setBooting(false);
        // Show welcome guide after boot
        setHistory([
            {
                output: [
                    { text: '' },
                    { text: '  ┌───────────────────────────────────────────┐', color: 'dim' },
                    { text: '  │  👋 Welcome to my terminal portfolio!     │', color: 'amber' },
                    { text: '  │                                           │', color: 'dim' },
                    { text: '  │  Try these commands to explore:           │', color: 'white' },
                    { text: '  │                                           │', color: 'dim' },
                    { text: '  │  $ help       — see all commands          │', color: 'green' },
                    { text: '  │  $ whoami     — learn about me            │', color: 'green' },
                    { text: '  │  $ projects   — view my work              │', color: 'green' },
                    { text: '  │  $ contact    — send me a message         │', color: 'green' },
                    { text: '  │  $ all        — see everything at once    │', color: 'green' },
                    { text: '  │                                           │', color: 'dim' },
                    { text: '  │  ↑↓ history | ←→ cursor | Tab complete   │', color: 'dim' },
                    { text: '  └───────────────────────────────────────────┘', color: 'dim' },
                    { text: '' },
                ],
            },
        ]);
    }, []);

    const handle = termConfig.personal.handle || 'portfolio';
    const prompt = `guest@${handle}:~$ `;

    return (
        <div
            ref={containerRef}
            className="terminal-container h-screen flex flex-col"
            onClick={focusInput}
        >
            {/* Chrome bar */}
            <div className="terminal-chrome">
                <div className="terminal-dot terminal-dot--red" />
                <div className="terminal-dot terminal-dot--yellow" />
                <div className="terminal-dot terminal-dot--green" />
                <span className="terminal-title">guest@{handle}:~$</span>
            </div>

            {/* Mobile quick-command bar — only visible on small screens via CSS */}
            {!booting && (
                <div className="mobile-cmd-bar">
                    {QUICK_CMDS.map((cmd) => (
                        <button
                            key={cmd}
                            className="mobile-cmd-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!typing) handleCommand(cmd);
                            }}
                            disabled={typing}
                        >
                            {cmd}
                        </button>
                    ))}
                </div>
            )}

            {/* Terminal Body */}
            <div ref={bodyRef} className="terminal-body">
                {booting ? (
                    <BootSequence onComplete={handleBootComplete} />
                ) : (
                    <>
                        {history.map((block, i) => (
                            <div key={i} className="mb-2">
                                {block.command !== undefined && (
                                    <div className="output-line">
                                        <span style={{ color: '#00FF00' }}>{prompt}</span>
                                        <span style={{ color: '#FFB300' }}>{block.command}</span>
                                    </div>
                                )}
                                {block.output.map((entry, j) => (
                                    <OutputLine key={j} entry={entry} />
                                ))}
                            </div>
                        ))}
                        <CommandInput onSubmit={handleCommand} disabled={typing || booting} prompt={prompt} />
                    </>
                )}
            </div>

            {/* Modals */}
            {projectModal && (
                <ProjectModal
                    project={projectModal}
                    onClose={() => setProjectModal(null)}
                />
            )}
            {showContactModal && (
                <ContactModal
                    onClose={() => setShowContactModal(false)}
                    onSuccess={() => {
                        setShowContactModal(false);
                        setHistory((prev) => [
                            ...prev,
                            { output: [{ text: '  ✅ Message sent! I\'ll get back to you soon.', color: 'green' as const }] },
                        ]);
                    }}
                />
            )}
        </div>
    );
};

export default Terminal;
