import type { OutputEntry } from './index';
import type { TerminalConfig } from './index';

export function sudo(cfg: TerminalConfig): OutputEntry[] {
    if (cfg.sudoLines && cfg.sudoLines.length > 0) {
        return cfg.sudoLines.map((line) => ({
            text: line ? `  ${line}` : '',
            color: line.startsWith('📨') || line.startsWith('🎉') ? 'amber' as const : 'green' as const,
        }));
    }

    // Fallback
    return [
        { text: '  📨 Great decision!', color: 'amber' },
        { text: '' },
        { text: `  Email  : ${cfg.personal.email}`, color: 'green' },
    ];
}
