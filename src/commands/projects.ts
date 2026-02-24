import type { OutputEntry } from './index';

export interface DynamicProject {
    _id: string;
    title: string;
    shortDesc?: string;
    description: string;
    stack?: string;
    imageUrl?: string;
    githubUrl?: string;
    liveUrl?: string;
    technologies: string[];
    highlights?: string[];
    featured?: boolean;
}

export function projects(data: DynamicProject[]): OutputEntry[] {
    const lines: OutputEntry[] = [];

    if (data.length === 0) {
        lines.push({ text: '  No projects found.', color: 'dim' });
        return lines;
    }

    // Calculate column widths from data
    const colNum = 2;
    const colName = Math.max(4, ...data.map((p) => p.title.length));
    const colDesc = Math.max(11, ...data.map((p) => (p.shortDesc || p.description.slice(0, 40)).length));

    const hr = (l: string, m: string, r: string) =>
        `  ${l}${'─'.repeat(colNum + 2)}${m}${'─'.repeat(colName + 2)}${m}${'─'.repeat(colDesc + 2)}${r}`;

    lines.push({ text: hr('┌', '┬', '┐'), color: 'dim' });
    lines.push({ text: `  │ ${'#'.padEnd(colNum)} │ ${'Name'.padEnd(colName)} │ ${'Description'.padEnd(colDesc)} │`, color: 'dim' });
    lines.push({ text: hr('├', '┼', '┤'), color: 'dim' });

    data.forEach((p, i) => {
        const num = String(i + 1).padEnd(colNum);
        const name = p.title.padEnd(colName);
        const desc = (p.shortDesc || p.description.slice(0, 40)).padEnd(colDesc);
        lines.push({ text: `  │ ${num} │ ${name} │ ${desc} │`, color: 'white' });
    });

    lines.push({ text: hr('└', '┴', '┘'), color: 'dim' });
    lines.push({ text: '' });
    lines.push({ text: "  Type 'project 1' for details", color: 'dim' });

    return lines;
}

export function projectDetail(num: number, data: DynamicProject[]): OutputEntry[] {
    const project = data[num - 1];
    if (!project) {
        return [{ text: `  Error: Project #${num} not found. Use 'projects' to see the list.`, color: 'red' }];
    }

    const lines: OutputEntry[] = [
        { text: `  📦 ${project.title}`, color: 'amber' },
        { text: '  ─────────────────────────────────────', color: 'dim' },
    ];

    if (project.stack) {
        lines.push({ text: `  Stack     : ${project.stack}`, color: 'white' });
    }

    if (project.githubUrl) {
        lines.push({ text: `  GitHub    : ${project.githubUrl}`, color: 'white', link: project.githubUrl });
    }

    if (project.liveUrl) {
        lines.push({ text: `  Live      : ${project.liveUrl}`, color: 'white', link: project.liveUrl });
    }

    lines.push({ text: '' });
    lines.push({ text: '  What I built:', color: 'amber' });
    project.description.split('\n').forEach((l) => {
        lines.push({ text: `  ${l}`, color: 'white' });
    });

    if (project.highlights && project.highlights.length > 0) {
        lines.push({ text: '' });
        lines.push({ text: '  Key highlights:', color: 'amber' });
        project.highlights.forEach((h) => {
            lines.push({ text: `  → ${h}`, color: 'green' });
        });
    }

    lines.push({ text: '' });

    // Show image hint if available
    if (project.imageUrl) {
        lines.push({ text: '  📷 Image available — opening preview...', color: 'cyan' });
    }

    const linkParts: string[] = [];
    if (project.githubUrl) linkParts.push(`[ GitHub ]`);
    if (project.liveUrl) linkParts.push(`[ Live Demo ]`);
    if (linkParts.length) {
        lines.push({
            text: `  ${linkParts.join('   ')}`,
            color: 'cyan',
            links: [
                ...(project.githubUrl ? [{ label: '[ GitHub ]', url: project.githubUrl }] : []),
                ...(project.liveUrl ? [{ label: '[ Live Demo ]', url: project.liveUrl }] : []),
            ],
        });
    }

    return lines;
}
