import type { OutputEntry } from './index';
import type { TerminalConfig } from './index';

export function education(cfg: TerminalConfig): OutputEntry[] {
    const e = cfg.education;
    const lines: OutputEntry[] = [
        { text: '  🎓 Education', color: 'amber' },
        { text: '  ─────────────────────────────────────', color: 'dim' },
        { text: `  Degree   : ${e.degree}`, color: 'white' },
        { text: `  College  : ${e.college}`, color: 'white' },
        { text: `  Year     : ${e.year}`, color: 'white' },
        { text: `  CGPA     : ${e.cgpa}`, color: 'white' },
        { text: '' },
        { text: '  Key Courses:', color: 'amber' },
    ];

    e.courses.forEach((c) => {
        if (c.trim()) lines.push({ text: `    → ${c}`, color: 'green' });
    });

    return lines;
}
