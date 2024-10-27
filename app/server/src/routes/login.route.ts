import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { ensureAuthenticated } from '../controller/auth.ctrl';

const router = express.Router();

// GitLab OAuth 인증 시작
router.get('/auth/gitlab', passport.authenticate('gitlab'));

// GitLab OAuth 콜백 처리
router.get('/auth/gitlab/callback', 
    passport.authenticate('gitlab', { failureRedirect: '/' }),
    (req: Request, res: Response, next: NextFunction) => {
        ensureAuthenticated(req, res, next);
        
        // 인증이 완료된 후 리디렉션
        res.redirect('/');
    }
);

// 프로필 페이지 (주석 처리된 부분은 주석을 해제하면 사용할 수 있습니다)
// router.get('/profile', ensureAuthenticated, (req: Request, res: Response) => {
//     res.render('profile', { user: req.user });
// });

module.exports = router;