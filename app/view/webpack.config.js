const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        ts: path.join(__dirname, 'ts'),
        styles: path.join(__dirname, 'static', 'scss', 'common.scss'),
    },
    output: {
        filename: '[name].bundle.js', // 출력 파일 이름
        path: path.join(__dirname, 'webPackBuild'), // 출력 디렉터리
    },
    resolve: {
        extensions: ['.ts', '.scss'], // 처리할 파일 확장자
    },
    module: {
        rules: [
            {
                test: /\.ts$/, // TypeScript 파일 처리
                use: 'ts-loader', // ts-loader 사용
                exclude: /node_modules/,
            },
            {
                // test: /\.scss/,
                test: path.join(__dirname, 'static', 'scss', 'common.scss'),
                use: [
                    MiniCssExtractPlugin.loader, // MiniCssExtractPlugin를 이용한 CSS 추출
                    'css-loader',
                    'sass-loader'
                ],
                exclude: /node_modules/,
            }
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.bundle.css', // CSS 파일 출력 경로
        }),
    ],
    mode: 'development', // 모드 설정 (development 또는 production)
};
