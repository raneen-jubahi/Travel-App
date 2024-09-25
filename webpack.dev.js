const common = require("./webpack.common.js"),
    { merge } = require("webpack-merge"),
    CssMinimizerPlugin = require("css-minimizer-webpack-plugin"),
    path = require("path");

module.exports = merge(common, {
    mode: "development",
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",  // يقوم بإضافة CSS إلى DOM
                    "css-loader",     // يقوم بقراءة ملفات CSS
                    "sass-loader"     // يقوم بتحويل SCSS إلى CSS
                ]
            }
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'var',
        library: 'Client',
        clean: true,
    },
    optimization: {
        minimizer: [
            // يمكنك استخدام الصيغة `...` لتمديد المعززات الموجودة (مثل `terser-webpack-plugin`)
            // `...`,
            new CssMinimizerPlugin(),
        ],
        minimize: true,
    },
});
