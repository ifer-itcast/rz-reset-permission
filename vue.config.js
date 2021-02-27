module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://ihrm-java.itheima.net',
                changeOrigin: true
            }
        }
    }
}