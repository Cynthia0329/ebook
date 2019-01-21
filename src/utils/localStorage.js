import Storage from 'web-storage-cache'

// 这个库最大的好处在于：
// 可以将传入的字符串（对象）转变为json进行存储
// 读取的时候，可以将json字符串再次转化为对象

const localStorage = new Storage()

export function setLocalStorage(key, value) {
  return localStorage.set(key, value)
}

export function getLocalStorage(key) {
  return localStorage.get(key)
}

export function removeLocalStorage(key) {
  return localStorage.delete(key)
}

export function clearLocalStorage() {
  return localStorage.clear()
}

// 因为每本电子书的设置可能不一样
// 所以给每本电子书都开启一个 localStorage 的空间
