export const getUserById = async (id) => {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    return data
}

export const refreshTokenAPI = async (refreshToken) => {
    const response = await fetch('/api/token/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh: refreshToken })
    });
    const data = await response.json();
    return data;
}