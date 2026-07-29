import { Request, Response, NextFunction } from 'express';
export declare function validate(req: Request, res: Response, next: NextFunction): void;
export declare function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): (req: Request, res: Response, next: NextFunction) => void;
export declare function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void;
