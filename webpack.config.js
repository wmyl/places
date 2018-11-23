//const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: __dirname + '/src/js/index.js',
    mode: 'production',
    output: {
        path: __dirname,
        filename: 'places.js',
        libraryTarget: 'umd',
        publicPath: '.',
    },
    module: {
        rules: [{
                include: __dirname + '/src',
                test: /\.(js|jsx)$/,
                //use: "babel-loader",
                loader: 'babel-loader',
                options: {
                    presets: ['env'],
                },
                exclude: /node_modules/
            }, {
                test: /\.scss$/,
                use: [{ loader: 'style-loader', options: { insertAt: 'top' } }, "css-loader", 'sass-loader']
            }]
    },
    resolve: {
        extensions: [".js"]
    },
    plugins: [
        // new MiniCssExtractPlugin({
        //     // Options similar to the same options in webpackOptions.output
        //     // both options are optional
        //     filename: "style.css",
        //     //chunkFilename: "[id].css"
        // })
    ]
};