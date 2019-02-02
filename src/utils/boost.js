// 拓展方法

// 给数组增添一个不添加重复元素的方法
/* eslint-disable no-extend-native */
Array.prototype.pushWithoutDuplicate = function () {
  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i]
    if (this.indexOf(arg) === -1) {
      this.push(arg)
    }
  }
}
