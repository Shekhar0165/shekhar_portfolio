import { useState } from 'react';
import { API_URL } from '../data/content';

interface ContactModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const ContactModal = ({ onClose, onSuccess }: ContactModalProps) => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setError('');

        try {
            const res = await fetch(`${API_URL}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error('Failed to send');

            onSuccess();
        } catch {
            setError('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        background: '#111',
        border: '1px solid #333',
        borderRadius: 6,
        padding: '10px 14px',
        color: '#FFB300',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 13,
        outline: 'none',
    };

    const labelStyle: React.CSSProperties = {
        color: '#888',
        fontSize: 12,
        marginBottom: 4,
        display: 'block',
        fontFamily: "'JetBrains Mono', monospace",
    };

    return (
        <div className="aws-modal-overlay" onClick={onClose}>
            <div
                className="aws-modal"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: 520, padding: 0 }}
            >
                {/* Header */}
                <div style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid #333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <div>
                        <h2 style={{ color: '#FFB300', fontSize: 16, margin: 0 }}>
                            📬 Send Message
                        </h2>
                        <p style={{ color: '#666', fontSize: 11, marginTop: 4 }}>
                            from shekharkashyap.dev
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#666',
                            fontSize: 18,
                            cursor: 'pointer',
                            padding: 4,
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 12 }}>
                        <div>
                            <label style={labelStyle}>Name *</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                style={inputStyle}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Email *</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                style={inputStyle}
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Subject *</label>
                        <input
                            type="text"
                            value={form.subject}
                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                            style={inputStyle}
                            placeholder="Let's work together"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={labelStyle}>Message *</label>
                        <textarea
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
                            placeholder="Hey Shekhar, I'd love to connect..."
                            required
                        />
                    </div>

                    {error && (
                        <div style={{
                            color: '#FF5555',
                            fontSize: 12,
                            marginBottom: 12,
                            fontFamily: "'JetBrains Mono', monospace",
                        }}>
                            ✖ {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                background: 'none',
                                border: '1px solid #333',
                                borderRadius: 6,
                                padding: '8px 20px',
                                color: '#888',
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 13,
                                cursor: 'pointer',
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={sending}
                            style={{
                                background: sending ? '#333' : 'linear-gradient(135deg, #FFB300, #FF8800)',
                                border: 'none',
                                borderRadius: 6,
                                padding: '8px 24px',
                                color: '#1a1a1a',
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 13,
                                fontWeight: 700,
                                cursor: sending ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {sending ? '⏳ Sending...' : '🚀 Send'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactModal;
