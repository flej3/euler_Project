import express, {Request, Response} from 'express';
import {logout} from '../controller/auth.ctrl';
const router = express.Router();

router.get("/logout", logout, (req:Request, res: Response) => {
    res.render("/");
})

module.exports = router;