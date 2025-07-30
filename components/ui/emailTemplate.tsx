
interface EmailTemplateProps {
    email: string,
    ResetPasswordToken: string,
}

export function emailTemplate({ email, ResetPasswordToken}: EmailTemplateProps) {
    return (
        <>
        <div
            style={{
            fontFamily: 'Segoe UI, Arial, sans-serif',
            backgroundColor: '#f9f9f9',
            padding: '40px',
            maxWidth: '600px',
            margin: '0 auto',
            borderRadius: '10px',
            border: '1px solid #e0e0e0',
            }}
        >
            <h2 style={{ color: '#333' }}>🔐 Reset Your Password</h2>

            <p style={{ fontSize: '16px', color: '#555' }}>
            Hi <strong>{email}</strong>,
            </p>

            <p style={{ fontSize: '16px', color: '#555' }}>
            We received a request to reset your password. Click the button below to set a new password:
            </p>

            <p style={{ textAlign: 'center', margin: '30px 0' }}>
            <a
                href={`http://localhost:3000/auth/reset-password?ResetPasswordToken=${encodeURIComponent(ResetPasswordToken)}`}
                style={{
                backgroundColor: '#0070f3',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
                }}
            >
                Reset Password
            </a>
            </p>

            <p style={{ fontSize: '14px', color: '#888' }}>
            If you didn't request this, no worries — you can safely ignore this email.
            </p>

            <hr style={{ borderColor: '#eee', margin: '30px 0' }} />

            <p style={{ fontSize: '12px', color: '#aaa' }}>
                This link will expire in 5 minutes for your security.
            </p>
        </div>
        </>
    );
}