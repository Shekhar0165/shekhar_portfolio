// ═══════════════════════════════════════════════════════════════
// Static content that doesn't come from the API
// ═══════════════════════════════════════════════════════════════

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Boot sequence lines (static — not editable from admin)
export const BOOT_LINES = [
    'BIOS v2.0.4 ... OK',
    'Loading kernel modules ... OK',
    'Mounting filesystems ... OK',
    'Starting network services ... OK',
    'Initializing portfolio daemon ... OK',
    '',
    '██████╗ ███████╗██╗   ██╗',
    '██╔══██╗██╔════╝██║   ██║',
    '██║  ██║█████╗  ██║   ██║',
    '██║  ██║██╔══╝  ╚██╗ ██╔╝',
    '██████╔╝███████╗ ╚████╔╝ ',
    '╚═════╝ ╚══════╝  ╚═══╝  ',
    '',
    'Portfolio OS v1.0.0',
    "Type 'help' to see available commands.",
    '------------------------------------------',
];
