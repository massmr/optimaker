export interface User {
    email: string;
    role: 'student' | 'superuser' | 'projectowner' | string;
}

export interface AuthResponse {
    token: string;
    user: User;
}