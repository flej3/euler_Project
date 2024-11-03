import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

const indexRouter = require('./routes/index.route');
const loginRouter = require('./routes/login.route');
const logoutRouter = require('./routes/logout.route');

app.use(indexRouter);
app.use(loginRouter);
app.use(logoutRouter);

app.use('/static', express.static(path.join(__dirname, '../../view/static')));
app.use('/webPackBuild', express.static(path.join(__dirname, '../../view/webPackBuild')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../view/ejs'));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});