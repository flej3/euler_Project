// app.ts
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { initializeGitLabOAuth } from './controller/auth.ctrl';

dotenv.config();

const app = express();
app.use(cors());
app.use(cookieParser());

// GitLab OAuth 설정 초기화
initializeGitLabOAuth();

app.use(session({ secret: process.env.SESSION_SECRET!, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

const indexRouter = require('./routes/index.route');
const loginRouter = require('./routes/login.route');
const logoutRouter = require('./routes/logout.route');
const refrashingRouter = require('./routes/refrash.route');

app.use(indexRouter);
app.use(loginRouter);
app.use(logoutRouter);
app.use(refrashingRouter);

app.use('/static', express.static(path.join(__dirname, '../../view/static')));
app.use('/webPackBuild', express.static(path.join(__dirname, '../../view/webPackBuild')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../view/ejs'));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});