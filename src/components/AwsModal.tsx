interface AwsModalProps {
    onClose: () => void;
}

const AwsModal = ({ onClose }: AwsModalProps) => {
    return (
        <div className="aws-modal-overlay" onClick={onClose}>
            <div className="aws-modal" onClick={(e) => e.stopPropagation()}>
                <button className="aws-modal-close" onClick={onClose}>✕</button>

                <h2 style={{ color: '#FFB300', marginBottom: 24, fontSize: 18 }}>
                    ☁️ AWS Architecture — Slay Backend
                </h2>

                {/* ASCII Architecture Diagram */}
                <pre style={{ color: '#e0e0e0', fontSize: 13, lineHeight: 1.8, overflowX: 'auto' }}>
                    {`
  ┌──────────────┐
  │   Internet   │
  └──────┬───────┘
         │
  ┌──────▼───────────┐
  │  CloudFront CDN  │
  └──┬───────────┬───┘
     │           │
┌────▼────┐  ┌───▼────────────────┐
│ S3      │  │ ALB                │
│ Static  │  │ (Load Balancer)    │
│ Frontend│  └───┬────────────────┘
└─────────┘      │
          ┌──────▼──────────────┐
          │ EC2 Auto Scaling    │
          │ Group               │
          └──┬───────┬──────┬───┘
             │       │      │
     ┌───────▼──┐ ┌──▼───┐ ┌▼──────────┐
     │ RDS      │ │Redis │ │ SQS Queue │
     │ Postgres │ │Cache │ │           │
     └──────────┘ └──────┘ └─────┬─────┘
                                 │
                          ┌──────▼──────┐
                          │ ECS Fargate │
                          │ (Transcoder)│
                          └──────┬──────┘
                                 │
                          ┌──────▼──────┐
                          │ S3 Output   │
                          │ (HLS Files) │
                          └─────────────┘
`}
                </pre>

                <p style={{ color: '#888', fontSize: 12, textAlign: 'center', marginTop: 16 }}>
                    Architecture of Slay — Social Media Backend
                </p>
            </div>
        </div>
    );
};

export default AwsModal;
