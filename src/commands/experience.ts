import type { OutputEntry } from './index';
import type { TerminalConfig } from './index';

export function experience(cfg: TerminalConfig): OutputEntry[] {
    const lines: OutputEntry[] = [
        { text: '  💼 Work Experience', color: 'amber' },
        { text: '  ─────────────────────────────────────', color: 'dim' },
    ];

    cfg.experience.forEach((exp) => {
        lines.push({ text: '' });
        lines.push({ text: `  ${exp.period}`, color: 'dim' });
        lines.push({ text: `  ${exp.role}${exp.company ? ` @ ${exp.company}` : ''}`, color: 'white' });
        exp.bullets.forEach((b) => {
            if (b.trim()) lines.push({ text: `    → ${b}`, color: 'green' });
        });
    });

    return lines;
}
