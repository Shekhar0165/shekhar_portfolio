import type { OutputEntry } from '../commands';

interface OutputLineProps {
    entry: OutputEntry;
}

const colorMap: Record<string, string> = {
    amber: '#FFB300',
    green: '#00FF00',
    red: '#FF5555',
    dim: '#888888',
    white: '#e0e0e0',
    cyan: '#06b6d4',
};

const OutputLine = ({ entry }: OutputLineProps) => {
    const color = colorMap[entry.color || 'amber'];

    // If the line has multiple links embedded in it
    if (entry.links && entry.links.length > 0) {
        return (
            <div className="output-line" style={{ color }}>
                {entry.links.map((l, i) => (
                    <span key={i}>
                        <a
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="term-link"
                        >
                            {l.label}
                        </a>
                        {i < entry.links!.length - 1 ? '   ' : ''}
                    </span>
                ))}
            </div>
        );
    }

    // If the line has a single link
    if (entry.link) {
        return (
            <div className="output-line">
                <a
                    href={entry.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="term-link"
                    style={{ color }}
                >
                    {entry.text}
                </a>
            </div>
        );
    }

    return (
        <div className="output-line" style={{ color }}>
            {entry.text || '\u00A0'}
        </div>
    );
};

export default OutputLine;
