import axios from 'axios'
import { setLocalForage } from '../utils/localForage' 

// 书架页面调用的api
export function shelf(id) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/shelf`,
    params: {
      id: id
    }
  })
}

// 书城主页调用的api
export function home() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/home`
  })
}

// 书城详情页调用的api
export function detail(book) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/detail`,
    params: {
      fileName: book.fileName
    }
  })
}

// 书城列表页调用的api
export function list() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/list`
  })
}

// 用户登录调用的api
export function login(name, pwd) {
  return axios.post('/login', { user: name, password: pwd })
}

// 电子书下载调用的api
export function download(book, onSucess, onError, onProgress) {
  // 如果只传入三个参数
  if (onProgress == null) {
    onProgress = onError
    onError = null
  }
  // 可以使用自定义配置新建一个 axios 实例
  // axios.create([config])
  return axios.create({
    baseURL: process.env.VUE_APP_EPUB_URL,
    method: 'get',
    responseType: 'blob', // 下载电子书是一个blob对象，这里定义了可以省去我们自己转换blob对象
    timeout: 180 * 1000, // 超时时间
    onDownloadProgress: progressEvent => { // 如果第4个参数onProgress存在，则返回progressEvent
      if (onProgress) onProgress(progressEvent)
    }
  }).get(`${book.categoryText}/${book.fileName}.epub`)
    .then(res => {
      // 将获取到的图书blob格式的文件保存到 indexDB 中（key值为书名）
      const blob = new Blob([res.data])
      setLocalForage(book.fileName, blob,
        () => onSucess(book), // 保存成功，则将图书
        err => onError(err)) // 保存失败，则将错误信息传递给第三个参数onError
    }).catch(err => { // 出现异常，则将错误信息传递给第三个参数onError
      if (onError) onError(err)
    })
}

export function sendAjax(file, onProgress) {
  var fd = new FormData() // 创建form对象
  fd.append('file', file) // 通过append向form对象添加数据
  console.log('test')
  console.log(file.name)

  return axios.post(`${process.env.VUE_APP_BASE_URL}/addGoods2`, fd, {
      onUploadProgress: (progressEvent) => { // 这里要用箭头函数
          // 不然这个this的指向会有问题
          if (onProgress) onProgress(progressEvent)
      }
  })
}

export function importEook(book, name) {
  // 将获取到的图书blob格式的文件保存到 indexDB 中（key值为书名）
  const blob = new Blob([book])
  console.log(name)
  setLocalForage(name, blob)
}
