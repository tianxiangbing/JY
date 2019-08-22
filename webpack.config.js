const path = require('path')
module.exports = {
    entry: './src/jy.js',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename:  process.env.mode ==='umd' ? 'jy-h5.js' :'jy.js',
        libraryTarget: process.env.mode || 'commonjs'
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.ts$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'ts-loader'
                }
            }
        ]
    }
}