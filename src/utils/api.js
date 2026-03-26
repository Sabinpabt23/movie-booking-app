// src/utils/api.js
export const setupAuthInterceptor = () => {
    if (typeof window === 'undefined') return;
    
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
        const response = await originalFetch(...args);
        
        // Check if response indicates locked account
        if (response.status === 403) {
            const data = await response.clone().json();
            if (data.isLocked) {
                // Clear user data and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login?locked=true';
            }
        }
        
        return response;
    };
};