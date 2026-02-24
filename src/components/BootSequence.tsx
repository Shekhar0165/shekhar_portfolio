import { useState, useEffect, useRef } from 'react';
import { BOOT_LINES } from '../data/content';

interface BootSequenceProps {
    onComplete: () => void;
}

const BootSequence = ({ onComplete }: BootSequenceProps) => {
    const [visibleLines, setVisibleLines] = useState<string[]>([]);
    const indexRef = useRef(0);
    const completedRef = useRef(false);

    useEffect(() => {
        indexRef.current = 0;
        completedRef.current = false;
        setVisibleLines([]);

        const interval = setInterval(() => {
            if (indexRef.current < BOOT_LINES.length) {
                const line = BOOT_LINES[indexRef.current];
                indexRef.current++;
                setVisibleLines((prev) => [...prev, line]);
            } else {
                clearInterval(interval);
                if (!completedRef.current) {
                    completedRef.current = true;
                    setTimeout(onComplete, 400);
                }
            }
        }, 120);

        return () => clearInterval(interval);
    }, [onComplete]);

    const getLineColor = (line: string): string => {
        if (!line) return '#e0e0e0';
        if (line.includes('OK')) return '#00FF00';
        if (line.includes('█') || line.includes('╗') || line.includes('╚') || line.includes('║') || line.includes('╔'))
            return '#FFB300';
        if (line.startsWith('Portfolio OS') || line.startsWith('Type') || line.startsWith('--'))
            return '#888888';
        return '#e0e0e0';
    };

    return (
        <div className="p-4">
            {visibleLines.map((line, i) => (
                <div
                    key={i}
                    className="output-line"
                    style={{ color: getLineColor(line) }}
                >
                    {line || '\u00A0'}
                </div>
            ))}
        </div>
    );
};

export default BootSequence;

