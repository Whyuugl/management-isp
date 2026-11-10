export type UserRole = 'administrator' | 'staff';

export type User = {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    roleLabel?: string;
    isAdministrator?: boolean;
    avatar?: string;
    email_verified_at: string | null;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User | null;
};
