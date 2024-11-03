import jwt from 'jsonwebtoken';
import {User} from '../types/gitlab.type';
import { Request, Response, NextFunction } from 'express';

export const getAccessToken = (user: User) => {
    return jwt.sign(user, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}

export const isAuthenticated = (req: Request): boolean => {
    const accessToken = req.cookies['accessToken'];
    if (!accessToken) {
        return false;
    }
    try {
        const user:User = jwt.verify(accessToken, process.env.JWT_SECRET!) as User;
        req.user = user;
        return true;
    } catch (error) {
        return false;
    }
};

export const checkAuthentication = (req: Request, res: Response) => {
    if (isAuthenticated(req)) {
        res.json({ message: 'User is authenticated', user: req.user });
    } else {
        res.status(401).json({ message: 'User is not authenticated' });
    }
};