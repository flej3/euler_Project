const express = require('express');
const ejs = require('ejs');
const path = require('path');
const dotenv = require('dotenv');

const app = express();

dotenv.config();

app.use(express.json());

const indexRouter = require('./routes/index.route');

//라우터 설정
app.use(indexRouter);

//정적파일
app.use('/webPackBuild', express.static(path.join(__dirname, '../../view/webPackBuild')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../view/ejs'));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});