import { whoami } from './whoami';
import { experience } from './experience';
import { projects, projectDetail } from './projects';
import type { DynamicProject } from './projects';
import { skills } from './skills';
import { education } from './education';
import { contact } from './contact';
import { resume } from './resume';
import { sudo } from './sudo';
import { blogs } from './blogs';
import { all } from './all';

export type { DynamicProject } from './projects';

export interface LinkInfo {
    label: string;
    url: string;
}

export interface OutputEntry {
    text: string;
    color?: 'amber' | 'green' | 'red' | 'dim' | 'white' | 'cyan';
    link?: string;
    links?: LinkInfo[];
}

export interface CommandResult {
    output: OutputEntry[];
    openContactModal?: boolean;
    openProjectModal?: DynamicProject;
}

/* ── Shared type matching backend terminal-config schema ── */
export interface TerminalConfig {
    personal: {
        name: string; handle: string; role: string; company: string; since: string;
        status: string; interests: string; location: string; tagline: string;
        email: string; linkedin: string; github: string; twitter: string; pageTitle: string;
        extraFields?: { label: string; value: string; link?: string; }[];
    };
    experience: { period: string; role: string; company: string; bullets: string[]; }[];
    skills: { category: string; items: { name: string; level: number; }[]; }[];
    education: { degree: string; college: string; year: string; cgpa: string; courses: string[]; };
    blogs: { title: string; url: string; }[];
    sudoLines: string[];
}

export const COMMAND_NAMES = [
    'help', 'whoami', 'experience', 'projects', 'project',
    'skills', 'education', 'blogs', 'contact', 'resume',
    'all', 'clear', 'sudo hire me',
];

function helpOutput(): OutputEntry[] {
    return [
        { text: '  ┌─────────────────────────────────────────────┐', color: 'dim' },
        { text: '  │  Available Commands                         │', color: 'amber' },
        { text: '  ├──────────────┬──────────────────────────────┤', color: 'dim' },
        { text: '  │  whoami      │  About me                    │', color: 'white' },
        { text: '  │  experience  │  Work history                │', color: 'white' },
        { text: '  │  projects    │  My projects                 │', color: 'white' },
        { text: '  │  project [n] │  Project details             │', color: 'white' },
        { text: '  │  skills      │  Tech stack with levels      │', color: 'white' },
        { text: '  │  education   │  College info                │', color: 'white' },
        { text: '  │  blogs       │  Read my blog posts          │', color: 'white' },
        { text: '  │  contact     │  Get in touch                │', color: 'white' },
        { text: '  │  resume      │  Download my resume          │', color: 'white' },
        { text: '  │  all         │  Show everything at once     │', color: 'white' },
        { text: '  │  clear       │  Clear terminal              │', color: 'white' },
        { text: '  │  sudo hire me│  ( ͡° ͜ʖ ͡°)                 │', color: 'white' },
        { text: '  └──────────────┴──────────────────────────────┘', color: 'dim' },
    ];
}

export function processCommand(
    raw: string,
    dynamicProjects: DynamicProject[],
    cfg: TerminalConfig,
): CommandResult {
    const input = raw.trim().toLowerCase();

    if (input === 'clear') return { output: [] };
    if (input === 'help') return { output: helpOutput() };
    if (input === 'whoami') return { output: whoami(cfg) };
    if (input === 'experience') return { output: experience(cfg) };
    if (input === 'projects') return { output: projects(dynamicProjects) };
    if (input === 'skills') return { output: skills(cfg) };
    if (input === 'education') return { output: education(cfg) };
    if (input === 'blogs') return { output: blogs(cfg) };
    if (input === 'contact') return { output: contact(cfg), openContactModal: true };
    if (input === 'resume') return { output: resume() };
    if (input === 'all') return { output: all(cfg, dynamicProjects) };
    if (input === 'sudo hire me') return { output: sudo(cfg) };

    // Handle "project N"
    const projectMatch = input.match(/^project\s+(\d+)$/);
    if (projectMatch) {
        const num = parseInt(projectMatch[1], 10);
        const proj = dynamicProjects[num - 1];
        return {
            output: projectDetail(num, dynamicProjects),
            openProjectModal: proj?.imageUrl ? proj : undefined,
        };
    }

    // Unknown command
    return {
        output: [{ text: `  bash: ${raw.trim()}: command not found`, color: 'red' }],
    };
}
