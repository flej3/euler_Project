import express, { Request, Response } from 'express';
import { handleGitLabUser } from '../controller/userHandler'
import { getAccessTokenFromCookies, getRefreshTokenFromCookies } from '../controller/auth.ctrl'

const router = express.Router();

router.get("/refrashing", async (req: Request, res: Response) => {
    try {
        const accessToken = getAccessTokenFromCookies(req);
        const refreshToken = getRefreshTokenFromCookies(req);
        
        const userProfile = await handleGitLabUser(accessToken!, refreshToken!);
        
        res.render("index", { userProfile });
    } catch (error) {
        console.error("Error during refrashing:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;