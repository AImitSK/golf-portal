export enum UserRole {
    ADMIN = 'admin',
    MANAGER = 'manager',
    STAFF = 'staff'
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    permissions?: string[];
    aktiv: boolean;
    emailVerified?: Date;
  }