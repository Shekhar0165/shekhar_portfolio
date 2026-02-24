import type { OutputEntry } from './index';
import type { TerminalConfig } from './index';

export function contact(cfg: TerminalConfig): OutputEntry[] {
    const p = cfg.personal;
    const lines: OutputEntry[] = [
        { text: '  📬 Let\'s Connect', color: 'amber' },
        { text: '  ─────────────────────────────────────', color: 'dim' },
    ];

    if (p.email) lines.push({ text: `  Email     : ${p.email}`, color: 'white', link: `mailto:${p.email}` });
    if (p.linkedin) lines.push({ text: `  LinkedIn  : ${p.linkedin}`, color: 'white', link: `https://${p.linkedin}` });
    if (p.github) lines.push({ text: `  GitHub    : ${p.github}`, color: 'white', link: `https://${p.github}` });
    if (p.twitter) lines.push({ text: `  Twitter   : ${p.twitter}`, color: 'white', link: `https://twitter.com/${p.twitter.replace('@', '')}` });

    lines.push({ text: '' });
    lines.push({ text: '  💬 Opening contact form...', color: 'green' });

    return lines;
}
