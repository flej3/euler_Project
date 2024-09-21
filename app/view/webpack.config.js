const path = require('path');
const glob = require('glob');

module.exports = {
    entry: glob.sync(path.join(__dirname, 'src/**/*.ts')), // 모든 .ts 파일 가져오기
    output: {
        filename: 'bundle.js', // 출력 파일 이름
        path: path.join(__dirname, 'webPackBuild'), // 출력 디렉터리
    },
    resolve: {
        extensions: ['.ts', '.js'], // 처리할 파일 확장자
    },
    module: {
        rules: [
            {
                test: /\.ts$/, // TypeScript 파일 처리
                use: 'ts-loader', // ts-loader 사용
                exclude: /node_modules/,
            },
        ],
    },
    mode: 'development', // 모드 설정 (development 또는 production)
};
