import type { OutputEntry } from './index';
import type { TerminalConfig } from './index';

export function blogs(cfg: TerminalConfig): OutputEntry[] {
    const lines: OutputEntry[] = [
        { text: '  📝 Blog Posts', color: 'amber' },
        { text: '  ─────────────────────────────────────', color: 'dim' },
    ];

    if (!cfg.blogs || cfg.blogs.length === 0) {
        lines.push({ text: '  No blog posts yet. Stay tuned!', color: 'dim' });
        return lines;
    }

    lines.push({ text: '' });

    cfg.blogs.forEach((blog, i) => {
        lines.push({
            text: `  ${i + 1}. ${blog.title}`,
            color: 'cyan',
            link: blog.url,
        });
    });

    lines.push({ text: '' });
    lines.push({ text: '  Click a title to read the full post →', color: 'dim' });

    return lines;
}
