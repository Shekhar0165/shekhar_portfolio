import type { OutputEntry, TerminalConfig } from './index';
import type { DynamicProject } from './projects';
import { whoami } from './whoami';
import { experience } from './experience';
import { projects } from './projects';
import { skills } from './skills';
import { education } from './education';
import { blogs } from './blogs';

export function all(cfg: TerminalConfig, dynamicProjects: DynamicProject[]): OutputEntry[] {
    const divider: OutputEntry = { text: '', color: 'dim' };
    const sectionBreak: OutputEntry = { text: '  ═══════════════════════════════════════', color: 'dim' };

    return [
        ...whoami(cfg),
        divider,
        sectionBreak,
        divider,
        ...experience(cfg),
        divider,
        sectionBreak,
        divider,
        ...projects(dynamicProjects),
        divider,
        sectionBreak,
        divider,
        ...skills(cfg),
        divider,
        sectionBreak,
        divider,
        ...education(cfg),
        divider,
        sectionBreak,
        divider,
        ...blogs(cfg),
    ];
}
