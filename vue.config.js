module.exports = {
  baseUrl: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  devServer: {
    port: 8029,
    // before(app) {
    //   mock(app, '/book/home', homeData)
    //   mock(app, '/book/shelf', shelfData)
    //   mock(app, '/book/list', listData)
    //   mock(app, '/book/flat-list', flatListData)
    // }
  }
}
