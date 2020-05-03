module.exports = {
    devServer: {
     // 设置代理
        proxy: {
            '/api': {
                target: 'http://localhost:5000',// 目标地址
                ws: true, // 是否启用websockets
                changeOrigin: true, // 开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
                pathRewrite: {'^/api': '/'}    // 这里重写路径
            },
            '/socket.io': {
                target: 'http://localhost:5000',
                ws: true,
                changeOrigin: true
            },
        }
    },
    chainWebpack: (config) => {
        config
            .plugin('html')
            .tap((args) => {
                args[0].title = '聊天室 - 网络一线牵，珍惜这段缘';
                return args;
            });
    },
    productionSourceMap: false,
    publicPath: process.env.NODE_ENV === 'production' ? "http://106.53.7.10/chatroom/" : "/"
};