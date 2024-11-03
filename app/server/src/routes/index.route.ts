import express, {Request, Response} from 'express';
import {isAuthenticated} from '../controller/jwt.ctrl';
import {getStarredProjectsMRs} from '../controller/gitlab.ctrl';
const router = express.Router();

router.get("/", (req:Request, res: Response) => {
    res.render("index");
})

router.get("/mergeRequest", async (req:Request, res: Response) => {
    try {
        if(isAuthenticated(req) && req.user){
            const mrList = await getStarredProjectsMRs(req.user.access_token_oauth!)
            res.json({success: true, mrList: mrList});
        } else {
            res.json({success: false});
        }
    } catch (error) {
        res.json()
    }
})

module.exports = router;