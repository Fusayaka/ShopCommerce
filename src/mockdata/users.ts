// src/mockdata/users.ts
// Mirrors the `users` seed, including the new contact + address fields.

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    contact?: string;
    address?: string;
    description?: string;
}

const mockUsers: User[] = [
    { id: 1000, name: "Minh Nguyen", email: "minh@example.com", avatar: "https://i.pravatar.cc/150?img=11", contact: "+84 901 000 001", address: "12 Le Loi, District 1, Ho Chi Minh City", description: "Streetwear enthusiast and weekend sneakerhead." },
    { id: 1001, name: "Lan Pham", email: "lan@example.com", avatar: "https://i.pravatar.cc/150?img=5", contact: "+84 901 000 002", address: "45 Nguyen Hue, District 1, Ho Chi Minh City", description: "Loves minimal basics and soft cotton tees." },
    { id: 1002, name: "Hoang Tran", email: "hoang@example.com", avatar: "https://i.pravatar.cc/150?img=15", contact: "+84 901 000 003", address: "78 Tran Hung Dao, District 5, Ho Chi Minh City", description: "Shops for comfy everyday fits." },
    { id: 1003, name: "Trang Le", email: "trang@example.com", avatar: "https://i.pravatar.cc/150?img=20", contact: "+84 901 000 004", address: "23 Hai Ba Trung, District 3, Ho Chi Minh City", description: "Into oversized styles and neutral tones." },
    { id: 1004, name: "Khoa Vu", email: "khoa@example.com", avatar: "https://i.pravatar.cc/150?img=33", contact: "+84 901 000 005", address: "9 Pham Ngu Lao, District 1, Ho Chi Minh City", description: "Casual dresser who values good fabric." },
    { id: 1005, name: "Linh Bui", email: "linh@example.com", avatar: "https://i.pravatar.cc/150?img=44", contact: "+84 901 000 006", address: "67 Vo Van Tan, District 3, Ho Chi Minh City", description: "Fan of bold colors and premium cotton." },
    { id: 1006, name: "Tuan Do", email: "tuan@example.com", avatar: "https://i.pravatar.cc/150?img=55", contact: "+84 901 000 007", address: "34 Dien Bien Phu, Binh Thanh, Ho Chi Minh City", description: "Collects classic tees in every color." },
    { id: 1007, name: "Ngoc Dang", email: "ngoc@example.com", avatar: "https://i.pravatar.cc/150?img=66", contact: "+84 901 000 008", address: "101 Cach Mang Thang 8, District 10, Ho Chi Minh City", description: "Prefers relaxed fits for daily wear." },
    { id: 1008, name: "Dat Ngo", email: "dat@example.com", avatar: "https://i.pravatar.cc/150?img=36", contact: "+84 901 000 009", address: "56 Ly Thuong Kiet, District 11, Ho Chi Minh City", description: "Always hunting for a good promo." },
    { id: 1009, name: "Huyen Ly", email: "huyen@example.com", avatar: "https://i.pravatar.cc/150?img=38", contact: "+84 901 000 010", address: "88 Nguyen Trai, District 5, Ho Chi Minh City", description: "Likes clean, simple designs." },
];

export default mockUsers;
