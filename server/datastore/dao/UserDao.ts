import { User } from '@ecommerce/shared';

export interface UserDao {
    createUser(user: User): Promise<[string, string, boolean]>, // returns userId,cartId and admin
    getUserById(id: string): Promise<User | undefined>;
    getUserByEmail(email: string): Promise<User | undefined>;
    getUserByUsername(username: string): Promise<User | undefined>;
    deleteUser(id: string): Promise<void>;
};