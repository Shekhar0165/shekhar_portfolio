import { API_URL } from '../data/content';
import type { OutputEntry } from './index';

export function resume(): OutputEntry[] {
    // Trigger the actual download
    setTimeout(() => {
        const link = document.createElement('a');
        link.href = `${API_URL}/resume`;
        link.download = 'ShekharKashyap_Resume.pdf';
        link.click();
    }, 1500);

    return [
        { text: '  Fetching resume from server...', color: 'amber' },
        { text: '  ✓ Resume found', color: 'green' },
        { text: '  ✓ Download starting...', color: 'green' },
    ];
}
