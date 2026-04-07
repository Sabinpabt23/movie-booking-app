'use client';

export default function TestPage() {
    return (
        <div>
            <h1>Test Page</h1>
            <p>If you see this, routing works</p>
            <button onClick={() => {
                localStorage.setItem('access_token', 'test123');
                localStorage.setItem('user', JSON.stringify({ user_id: 1, user_name: 'Test' }));
                window.location.href = '/dashboard';
            }}>
                Go to Dashboard
            </button>
        </div>
    );
}