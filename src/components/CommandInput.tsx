import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { COMMAND_NAMES } from '../commands';

interface CommandInputProps {
    onSubmit: (command: string) => void;
    disabled: boolean;
    prompt?: string;
}

const CommandInput = ({ onSubmit, disabled, prompt: promptProp }: CommandInputProps) => {
    const [value, setValue] = useState('');
    const [cursorPos, setCursorPos] = useState(0);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!disabled && inputRef.current) {
            inputRef.current.focus();
        }
    }, [disabled]);

    // Sync cursor with hidden input's selection
    const syncCursor = () => {
        if (inputRef.current) {
            setCursorPos(inputRef.current.selectionStart ?? value.length);
        }
    };

    const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && value.trim()) {
            setHistory((prev) => [value.trim(), ...prev]);
            setHistoryIndex(-1);
            onSubmit(value.trim());
            setValue('');
            setCursorPos(0);
            return;
        }

        // Up arrow — cycle history
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length === 0) return;
            const next = Math.min(historyIndex + 1, history.length - 1);
            setHistoryIndex(next);
            setValue(history[next]);
            setCursorPos(history[next].length);
            return;
        }

        // Down arrow
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex <= 0) {
                setHistoryIndex(-1);
                setValue('');
                setCursorPos(0);
                return;
            }
            const next = historyIndex - 1;
            setHistoryIndex(next);
            setValue(history[next]);
            setCursorPos(history[next].length);
            return;
        }

        // Tab — autocomplete
        if (e.key === 'Tab') {
            e.preventDefault();
            const partial = value.toLowerCase();
            if (!partial) return;
            const match = COMMAND_NAMES.find((c) => c.startsWith(partial) && c !== partial);
            if (match) {
                setValue(match);
                setCursorPos(match.length);
            }
            return;
        }

        // Home key
        if (e.key === 'Home') {
            e.preventDefault();
            setCursorPos(0);
            if (inputRef.current) inputRef.current.setSelectionRange(0, 0);
            return;
        }

        // End key
        if (e.key === 'End') {
            e.preventDefault();
            setCursorPos(value.length);
            if (inputRef.current) inputRef.current.setSelectionRange(value.length, value.length);
            return;
        }

        // For left/right arrows, let the hidden input handle it and sync after
        setTimeout(syncCursor, 0);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        setValue(newVal);
        setHistoryIndex(-1);
        // Sync cursor position after React re-renders
        setTimeout(() => {
            if (inputRef.current) {
                setCursorPos(inputRef.current.selectionStart ?? newVal.length);
            }
        }, 0);
    };

    const prompt = promptProp || 'guest@portfolio:~$ ';
    const beforeCursor = value.slice(0, cursorPos);
    const afterCursor = value.slice(cursorPos);

    return (
        <div className="command-input-wrapper" onClick={() => inputRef.current?.focus()}>
            <span className="command-prompt">{prompt}</span>
            <span style={{ color: '#FFB300' }}>{beforeCursor}</span>
            <span className="cursor-blink">█</span>
            {afterCursor && <span style={{ color: '#FFB300' }}>{afterCursor}</span>}
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={handleChange}
                onKeyDown={handleKey}
                onKeyUp={syncCursor}
                onClick={syncCursor}
                className="command-input"
                disabled={disabled}
                autoFocus
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                style={{
                    position: 'absolute',
                    opacity: 0,
                    width: 0,
                    height: 0,
                    padding: 0,
                    border: 'none',
                }}
            />
        </div>
    );
};

export default CommandInput;
