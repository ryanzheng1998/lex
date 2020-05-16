const path = require("path");

module.exports = {
    entry: {
        main: "./src/main.ts",
        playground: "./src/playground.ts"  
    },
    target: "node",
    mode: "development",
    resolve: {
        extensions: [".ts", ".js"]
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader"
            },
        ]
    },
}