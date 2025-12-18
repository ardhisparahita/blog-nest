import { Request } from 'express';
import { Role } from 'src/auth/enum/role.enum';

export interface UserPayload {
  id: string;
  email?: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user: UserPayload;
}
