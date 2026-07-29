import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User.js';
export interface AuthRequest extends Request {
    user?: IUser;
}
export declare function authenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void;
export declare function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction): void;
