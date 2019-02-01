import axios from 'axios'
// import { setLocalForage } from '../utils/localForage' 

// export function flatList() {
//   return axios({
//     method: 'get',
//     url: `${process.env.VUE_APP_BOOK_URL}/book/flat-list`
//   })
// }

// 书架页面调用的api
export function shelf() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/shelf`
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

// export function download(book, onSucess, onError, onProgress) {
//   if (onProgress == null) {
//     onProgress = onError
//     onError = null
//   }
//   return axios.create({
//     baseURL: process.env.VUE_APP_EPUB_URL,
//     method: 'get',
//     responseType: 'blob',
//     timeout: 180 * 1000,
//     onDownloadProgress: progressEvent => {
//       if (onProgress) onProgress(progressEvent)
//     }
//   }).get(`${book.categoryText}/${book.fileName}.epub`)
//     .then(res => {
//       const blob = new Blob([res.data])
//       setLocalForage(book.fileName, blob,
//         () => onSucess(book),
//         err => onError(err))
//     }).catch(err => {
//       if (onError) onError(err)
//     })
// }
