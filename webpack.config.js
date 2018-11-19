module.exports = {
    entry: __dirname + '/src/js/index.js',
    mode: 'production',
    output: {
        path: __dirname,
        filename: 'places.js',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                include: __dirname + '/src',
                test: /\.(js|jsx)$/,
                //use: "babel-loader",
                loader: 'babel-loader',
                options: {
                    presets: ['env'],
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    resolve: {
        extensions: [".js"]
    },
};