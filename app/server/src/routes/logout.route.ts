import express, {Request, Response} from 'express';
const router = express.Router();

router.get("/logout", (req:Request, res: Response) => {
    res.clearCookie('accessToken');
    res.redirect("/");
})

module.exports = router;