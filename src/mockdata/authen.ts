// null/undefined (a user that has not set one up yet). Password is a bcrypt placeholder.

import mockUsers from "./users";

export interface Authen {
    id: number;
    userId: number;
    username?: string;
    email: string;
    password: string;
}

const PLACEHOLDER_PASSWORD = "$2b$10$abcdefghijklmnopqrstuvQ8Z0m9rN0m9rN0m9rN0m9rN0m9rN0m9";

const mockAuthen: Authen[] = mockUsers.map((user, index) => ({
    id: index + 1,
    userId: user.id,
    username: user.email.split("@")[0],
    email: user.email,
    password: PLACEHOLDER_PASSWORD,
}));

export default mockAuthen;
