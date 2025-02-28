import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import jwt from 'jsonwebtoken';
import { IUser } from "../models/User";

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        const error = new Error('Unauthorized');
        res.status(401).json({error: error.message});
        return;
    }

    const token = bearer.split(' ')[1];

    if (!token) {
        const error = new Error('Unauthorized');
        res.status(401).json({error: error.message});
    }

    try {
        const result = await jwt.verify(token, process.env.JWT_SECRET);
        debugger
        if (typeof result === 'object' && result.id) {
            const user = await User.findById(result.id).select('-password');
            if (!user) {
                const error = new Error('User not found');
                res.status(404).json({error: error.message});
                return;
            }
            req.user = user;
            next();
        }

    } catch (error) {
        res.status(500).json({error: 'Token no valido'});
    }
}