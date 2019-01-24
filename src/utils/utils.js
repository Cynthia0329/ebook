// 将px转化为相应的rem
export function px2rem(px) {
  const ratio = 375 / 10
  return px / ratio
}

// 像素值根据当前屏幕rem的缩放比例计算出真实的像素
export function realPx(px) {
  const maxWidth = window.innerWidth > 500 ? 500 : window.innerWidth
  return px * (maxWidth / 375)
}
