import { Role } from './enums/role.enum';

export interface User {
  id: number;
  username: string;
  password?: string; 
  role: Role;
}