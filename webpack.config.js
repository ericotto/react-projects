var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        a: path.resolve(__dirname, "./js/routes.js")
    },
    output: {
        path: path.resolve(__dirname, './js/'),
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['react-hot', 'babel?presets[]=react,presets[]=es2015,presets[]=stage-2'],
                exclude: /node_modules/
            }
        ]
    }
}