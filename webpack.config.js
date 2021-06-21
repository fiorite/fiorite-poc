const path = require('path');

module.exports = {
    entry: {
        index: './src/index.ts',
        iteration: './src/iteration/index.ts',
        operators: './src/operators/index.ts',
        collections: './src/collections/index.ts',
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
};
