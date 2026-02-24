import type { OutputEntry } from './index';
import type { TerminalConfig } from './index';

export function whoami(cfg: TerminalConfig): OutputEntry[] {
    const p = cfg.personal;
    const lines: OutputEntry[] = [
        { text: `  👤 ${p.name}`, color: 'amber' },
        { text: '  ─────────────────────────────────────', color: 'dim' },
        { text: `  Role       : ${p.role} @ ${p.company}`, color: 'white' },
        { text: `  Since      : ${p.since}`, color: 'white' },
        { text: `  Status     : ${p.status}`, color: 'white' },
        { text: `  Interests  : ${p.interests}`, color: 'white' },
        { text: `  Location   : ${p.location}`, color: 'white' },
    ];

    // Render extra custom fields
    if (p.extraFields && p.extraFields.length > 0) {
        p.extraFields.forEach((ef) => {
            if (ef.label && ef.value) {
                const padded = ef.label.padEnd(10);
                if (ef.link) {
                    lines.push({ text: `  ${padded} : ${ef.value}`, color: 'white', link: ef.link });
                } else {
                    lines.push({ text: `  ${padded} : ${ef.value}`, color: 'white' });
                }
            }
        });
    }

    lines.push({ text: '' });
    lines.push({ text: `  ${p.tagline}`, color: 'green' });

    return lines;
}
