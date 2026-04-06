let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(promise => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });
    failedQueue = [];
};

export const setupTokenInterceptor = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
        let [url, options = {}] = args;
        
        // Get access token
        let accessToken = localStorage.getItem('access_token');
        
        // Add token to headers
        if (accessToken) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${accessToken}`
            };
        }
        
        let response = await originalFetch(url, options);
        
        // If unauthorized (401), try to refresh token
        if (response.status === 401) {
            const refreshToken = localStorage.getItem('refresh_token');
            
            if (!refreshToken) {
                // No refresh token, redirect to login
                localStorage.clear();
                window.location.href = '/login';
                return response;
            }
            
            // If already refreshing, queue the request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject, url, options });
                });
            }
            
            isRefreshing = true;
            
            try {
                const refreshResponse = await originalFetch(`${API_URL}/api/auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh_token: refreshToken })
                });
                
                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    localStorage.setItem('access_token', data.access_token);
                    localStorage.setItem('refresh_token', data.refresh_token);
                    
                    // Retry original request with new token
                    options.headers['Authorization'] = `Bearer ${data.access_token}`;
                    processQueue(null, data.access_token);
                    return originalFetch(url, options);
                } else {
                    // Refresh failed, clear storage and redirect to login
                    localStorage.clear();
                    processQueue(new Error('Refresh failed'), null);
                    window.location.href = '/login';
                    return response;
                }
            } catch (error) {
                processQueue(error, null);
                localStorage.clear();
                window.location.href = '/login';
                return response;
            } finally {
                isRefreshing = false;
            }
        }
        
        return response;
    };
};