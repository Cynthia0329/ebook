import axios from 'axios'
import qs from 'qs'

// post提交一条用户信息
export function toRegister(id, name, pwd) {
  return axios({
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-=urlencoded;charset=UTF-8'
      },
      method: 'post',
      url: `${process.env.VUE_APP_BASE_URL}/register`,
      data: qs.stringify({
        id: 250,
        name: name,
        pwd: pwd
      })
  })
}

// 将本地的数据全部提交给服务器
export function localToServer(id, key, str) {
  return axios({
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-=urlencoded;charset=UTF-8'
    },
    method: 'post',
    url: `${process.env.VUE_APP_BASE_URL}/local`,
    timeout: 180 * 1000, // 超时时间
    // data: str
    data: qs.stringify({
      jsonStr: str
    })
  })
}
