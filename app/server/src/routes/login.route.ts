import express, { Request, Response } from 'express';
import {User} from '../types/gitlab.type';
import {getAccessToken, isAuthenticated} from '../controller/jwt.ctrl';
const router = express.Router();

router.get('/auth/gitlab', (req: Request, res: Response) => {
    const redirectUri = `https://gitlab.synap.co.kr/oauth/authorize?client_id=${process.env.GITLAB_CLIENT_ID}&redirect_uri=${process.env.GITLAB_CLIENT_CALLBACK_URL}&response_type=code&scope=read_user api read_registry openid`;
    res.redirect(redirectUri);
})

router.get('/auth/gitlab/callback', async (req: Request, res: Response) => {
    const {code} = req.query;
    try{
        const tokenResponse = await fetch('https://gitlab.synap.co.kr/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.GITLAB_CLIENT_ID,
                client_secret: process.env.GITLAB_CLIENT_SECRET,
                redirect_uri: process.env.GITLAB_CLIENT_CALLBACK_URL,
                code,
                grant_type: 'authorization_code',
            }),
        });
        const { access_token, refresh_token } = await tokenResponse.json();
        const userReponse = await fetch('https://gitlab.synap.co.kr/api/v4/user', {
            headers:{
                Authorization: `Bearer ${access_token}`,
            },
        });

        let user:User = await userReponse.json();
        user = { ...user, access_token_oauth: access_token, refresh_token_oauth: refresh_token}
        const jwtToken = getAccessToken({id: user.id, name: user.name, username: user.username, email: user.email, access_token_oauth: access_token, refresh_token_oauth: refresh_token});

        res.cookie('accessToken', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60,
        });

        req.user = user;
        res.redirect('/');
    }catch(err) {
        console.error('Error during GitLab OAuth:', err);
        res.status(500).json({ message: 'Authentication failed' });
    }
});

router.get('/userInfo', (req: Request, res: Response) => {
    if(isAuthenticated(req) && req.user){
        res.json({success: true, userInfo: req.user});
    } else {
        res.json({success: false});
    }
});

module.exports = router;