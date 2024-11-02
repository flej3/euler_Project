import passport from 'passport';
import OAuth2Strategy from 'passport-oauth2';
import { Request, Response as ExpressResponse, NextFunction } from 'express';
import { handleGitLabUser } from './userHandler';

// Request 타입 확장
declare global {
    namespace Express {
        interface User {
            accessToken?: string;
            refreshToken?: string;
        }
    }
}

export const initializeGitLabOAuth = () => {
    passport.use('gitlab', new OAuth2Strategy({
        authorizationURL: 'https://gitlab.synap.co.kr/oauth/authorize',
        tokenURL: 'https://gitlab.synap.co.kr/oauth/token',
        clientID: process.env.GITLAB_CLIENT_ID!,
        clientSecret: process.env.GITLAB_CLIENT_SECRET!,
        callbackURL: "http://localhost:4000/auth/gitlab/callback",
        scope: ['read_user', 'api', 'read_registry', 'openid']
    }, async (accessToken: string, refreshToken: string, profile: passport.Profile, done: (error: any, user?: any) => void) => {
        try {
            const userProfile = await handleGitLabUser(accessToken, refreshToken);
            done(null, userProfile); // 사용자 프로필과 함께 전달
        } catch (error) {
            console.error('Error fetching user profile:', error);
            done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user: any, done) => {
        done(null, user);
    });
};

// Access Token 갱신 함수
const refreshAccessToken = async (req: Request, res: ExpressResponse): Promise<string | null> => {
    const response = await fetch('https://gitlab.synap.co.kr/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            grant_type: 'refresh_token',
            refresh_token: getRefreshTokenFromCookies(req),
            client_id: process.env.GITLAB_CLIENT_ID,
            client_secret: process.env.GITLAB_CLIENT_SECRET,
        }),
    });

    if (response.ok) {
        const data = await response.json();
        return data.access_token;
    } else {
        console.error('Failed to refresh access token');
        return null;
    }
};

// Access Token을 쿠키에 저장
const setAccessTokenInCookies = (res: ExpressResponse, token: string) => {
    res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60, // 1시간 유효
    });
};

// Refresh Token을 쿠키에 저장
const setRefreshTokenInCookies = (res: ExpressResponse, token: string) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 6, // 6시간 유효
    });
};

// 쿠키에서 Access Token을 가져오기
export const getAccessTokenFromCookies = (req: Request): string | null => {
    return req.cookies['accessToken'] || null;
};

// 쿠키에서 Refresh Token을 가져오기
export const getRefreshTokenFromCookies = (req: Request): string | null => {
    return req.cookies['refreshToken'] || null;
};

// 인증 미들웨어
export const ensureAuthenticated = (req: Request, res: ExpressResponse, next: NextFunction) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        if (req.user?.accessToken) {
            setAccessTokenInCookies(res, req.user.accessToken);
        }

        if (req.user?.refreshToken) {
            setRefreshTokenInCookies(res, req.user.refreshToken);
        }

        return next();
    } else {
        res.redirect('/auth/gitlab');
    }
};

export const logout = (req: Request, res: ExpressResponse) => {
    req.logout((err) => {
        if (err) {
            console.error('Error logging out:', err);
            return res.status(500).send('Error logging out');
        }
        res.clearCookie('accessToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.clearCookie('connect.sid', { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.redirect('/');
    });
};