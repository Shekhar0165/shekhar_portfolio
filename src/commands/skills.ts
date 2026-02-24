import type { OutputEntry } from './index';
import type { TerminalConfig } from './index';

export function skills(cfg: TerminalConfig): OutputEntry[] {
    const lines: OutputEntry[] = [
        { text: '  🛠️  Tech Stack', color: 'amber' },
        { text: '  ─────────────────────────────────────', color: 'dim' },
    ];

    cfg.skills.forEach((cat) => {
        lines.push({ text: '' });
        lines.push({ text: `  [ ${cat.category} ]`, color: 'cyan' });
        cat.items.forEach((item) => {
            const filled = Math.round(item.level / 5);
            const empty = 20 - filled;
            const bar = '█'.repeat(filled) + '░'.repeat(empty);
            lines.push({ text: `    ${item.name.padEnd(25)} ${bar}  ${item.level}%`, color: 'white' });
        });
    });

    return lines;
}
