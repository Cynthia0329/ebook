<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{text}}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
      <bookmark :color="color" :width="15" :height="35"></bookmark>
    </div>
  </div>
</template>

<script>
  import { realPx } from '../../utils/utils'
  import Bookmark from '../common/Bookmark'
  import { ebookMixin } from '../../utils/mixin'
  import { getBookmark, saveBookmark } from '../../utils/localStorage'

  const BLUE = '#346cbc'
  const WHITE = '#fff'
  export default {
    mixins: [ebookMixin],
    components: {
      Bookmark
    },
    computed: {
      // 书签组件跟随下拉的临界高度
      height() {
        return realPx(35)
      },
      // 书签组件变色的临界高度
      threshold() {
        return realPx(55)
      },
      // 当给当前页面添加了固定书签的样式
      fixedStyle() {
        return {
          position: 'fixed',
          top: 0,
          right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`
        }
      }
    },
    watch: {
      // 监听offsetY的值的改变，根据改变的值来触发不同的事件
      // 注意if条件
      offsetY(v) {
        if (!this.bookAvailable || this.menuVisible || this.settingVisible >= 0) {
          return
        }
        // 第二阶段：下拉吸顶状态（书签组件固定在顶部）
        if (v >= this.height && v < this.threshold) {
          this.beforeThreshold(v)
        }
        // 第三阶段： 书签组件改变颜色，文字改变为“松手”
        else if (v >= this.threshold) {
          this.afterThreshold(v)
        } 
        // 第一阶段：跟随index组件一起向下移动
        else if (v > 0 && v < this.height) {
          this.beforeHeight()
        } 
        // 第四阶段：书签归位
        else if (v === 0) {
          this.restore()
        }
      },
      // 监听isBookmark的值 => 判断isFixed的值 => 是否显示固定书签
      isBookmark(isBookmark) {
        this.isFixed = isBookmark
        if (isBookmark) {
          this.color = BLUE
        } else {
          this.color = WHITE
        }
      }
    },
    data() {
      return {
        text: '',
        color: WHITE,
        isFixed: false // 判断当前是否将页面中的书签的position变为fixed
      }
    },
    methods: {
      // 添加书签
      addBookmark() {
        this.bookmark = getBookmark(this.fileName)
        if (!this.bookmark) {
          this.bookmark = []
        }
        const currentLocation = this.currentBook.rendition.currentLocation()
        // start的cfi："epubcfi(/6/8[A387243_1_En_2_Chapter]!/4/2/2[Chap2]/2/1:0)"
        // end  的cfi："epubcfi(/6/8[A387243_1_En_2_Chapter]!/4/10/2[Par3]/5:90)"

        // 获取start中 epubcfi(/6/8[A387243_1_En_2_Chapter] 部分内容（是该页内容所处的文件位置）
        const cfibase = currentLocation.start.cfi.replace(/!.*/, '')
        // 获取start中 /4/2/2[Chap2]/2/1:0 部分内容（是该页内容第一个字在文件中的精确位置）
        const cfistart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)$/, '')
        // 获取end  中 /4/10/2[Par3]/5:90 部分内容（是该页内容最后一个字在文件中的精确位置）
        const cfiend = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)$/, '')

        // epubcfi(/6/8[A387243_1_En_2_Chapter]!,/4/2/2[Chap2]/2/1:0,/4/10/2[Par3]/5:90)
        const cfirange = `${cfibase}!,${cfistart},${cfiend})`

        // 将上面拼接得到的字符串传入getRange()方法中，可以得到这个范围的文本
        this.currentBook.getRange(cfirange).then(range => {
          const text = range.toString().replace(/\s\s/g, '') // 去除文本中多余的空格
          // 将cfi和文本 追加保存 在本地存储的 bookmark 数组中
          this.bookmark.push({
            cfi: currentLocation.start.cfi,
            text: text
          })
          saveBookmark(this.fileName, this.bookmark)
        })
      },
      // 移除书签
      removeBookmark() {
        const currentLocation = this.currentBook.rendition.currentLocation()
        const cfi = currentLocation.start.cfi
        this.bookmark = getBookmark(this.fileName)
        // 当书签数组存在的时候
        if (this.bookmark) {
          // 过滤掉数组中等于当前cif的对象，剩余的对象返回一个新数组保存在本地
          saveBookmark(this.fileName, this.bookmark.filter(item => item.cfi !== cfi))
          // 将当前页设置为“不是书签页”
          this.setIsBookmark(false)
        }
      },
      // 第四阶段：书签归位，初始化书签的top值，图标向下↓，并把书签蓝色图标固定在当前页面的右上角
      // 设置定时器：等待箭头过渡动画结束
      // 通过判断是否有固定的书签图标来设置 vuex中 isBookmark 的值
      restore() {
        // 状态4：归位
        setTimeout(() => {
          this.$refs.bookmark.style.top = `${-this.height}px`
          this.$refs.iconDown.style.transform = 'rotate(0deg)'
        }, 200)
        if (this.isFixed) {
          this.setIsBookmark(true)
          this.addBookmark()
        } else {
          this.setIsBookmark(false)
          this.removeBookmark()
        }
      },
      // 第一阶段：跟随index组件一起向下移动
      // 设置文字，书签颜色的初始值
      beforeHeight() {
        // 状态1：未超过书签的高度
        if (this.isBookmark) {
          this.text = this.$t('book.pulldownDeleteMark')
          this.color = BLUE
          this.isFixed = true
        } else {
          this.text = this.$t('book.pulldownAddMark')
          this.color = WHITE
          this.isFixed = false
        }
      },
      // 第二阶段：下拉吸顶状态（书签组件固定在顶部），箭头朝下↓
      beforeThreshold(v) {
        // 状态2：未到达零界状态
        this.$refs.bookmark.style.top = `${-v}px`
        this.beforeHeight()
        const iconDown = this.$refs.iconDown
        if (iconDown.style.transform === 'rotate(180deg)') {
          iconDown.style.transform = 'rotate(0deg)'
        }
      },
      // 第三阶段： 书签组件改变颜色，文字改变为“松手”，箭头朝上↑
      afterThreshold(v) {
        // 状态3：超越零界状态
        this.$refs.bookmark.style.top = `${-v}px`
        if (this.isBookmark) {
          this.text = this.$t('book.releaseDeleteMark')
          this.color = WHITE
          this.isFixed = false
        } else {
          this.text = this.$t('book.releaseAddMark')
          this.color = BLUE
          this.isFixed = true
        }
        const iconDown = this.$refs.iconDown
        if (iconDown.style.transform === '' ||
          iconDown.style.transform === 'rotate(0deg)') {
          iconDown.style.transform = 'rotate(180deg)'
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook-bookmark {
    position: absolute;
    top: px2rem(-35);
    left: 0;
    z-index: 200;
    width: 100%;
    height: px2rem(35);
    .ebook-bookmark-text-wrapper {
      position: absolute;
      right: px2rem(45);
      bottom: 0;
      display: flex;
      .ebook-bookmark-down-wrapper {
        font-size: px2rem(14);
        color: white;
        transition: all .2s linear;
        @include center;
      }
      .ebook-bookmark-text {
        font-size: px2rem(14);
        color: white;
      }
    }
    .ebook-bookmark-icon-wrapper {
      position: absolute;
      right: 0;
      bottom: 0;
      margin-right: px2rem(15);
    }
  }
</style>
