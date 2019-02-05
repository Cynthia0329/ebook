<template>
  <div class="shelf-item"
       :class="{'shelf-item-shadow': data.type === 1 || data.type === 2}"
       @click="onItemClick">
    <!-- 动态组件：根据传入的type值，生成不同的图书组件（默认，分类，添加） -->
    <component class="shelf-item-comp"
               :class="{'is-edit': isEditMode && data.type === 2}"
               :is="item"
               :data="data">
    </component>
    <!-- 编辑模式下出现的图标 -->
    <div class="icon-selected"
         :class="{'is-selected': data.selected}"
         v-show="isEditMode && (data.type === 1 || data.type === 4) ">
    </div>
  </div>
</template>

<script>
  import { getLocalForage } from '../../utils/localForage'
  import { storeShelfMixin } from '../../utils/mixin'
  import ShelfBook from './ShelfItemBook'
  import ShelfCategory from './ShelfItemCategory'
  import ShelfAdd from './ShelfItemAdd'
  import ShelfItemImport from './ShelfItemImport'
  import { gotoStoreHome } from '../../utils/store'

  export default {
    mixins: [storeShelfMixin],
    props: {
      data: Object  // shelfList数组下的item
    },
    computed: {
      item() {
        switch (this.data.type) {
          case 1:
          return this.book
          case 2:
          return this.category
          case 3:
          return this.add
          case 4:
          return this.impo
        }
      }
    },
    data() {
      return {
        book: ShelfBook,
        category: ShelfCategory,
        add: ShelfAdd,
        impo: ShelfItemImport
      }
    },
    methods: {
      // 隐藏弹出框
      hidePopup() {
        this.popupMenu.hide()
      },
      // 创建弹出框按钮事件（调用一次，只创建一条）
      createPopupBtn(text, onClick, type = 'normal') {
        return {
          text: text,
          type: type,
          click: onClick
        }
      },
      onItemClick() {
        // 判断是否处于编辑模式下
        if (this.isEditMode) {
          if (this.data.type === 1 || this.data.type === 4) {
            // 点击之后，设置图书的selected属性
          this.data.selected = !this.data.selected
          if (this.data.selected) {
            this.shelfSelected.pushWithoutDuplicate(this.data)
            this.setShelfSelected(this.shelfSelected)
          } else {
            this.setShelfSelected(this.shelfSelected.filter(item => item.id !== this.data.id))
          }
          }
          
        } else {
          // 不是编辑模式的时候
          if (this.data.type === 1) { // 1：展示图书详情
            this.showBookDetail(this.data)
          } else if (this.data.type === 2) {  // 2：展示书架分类组
            this.$router.push({
              path: '/store/category',
              query: {
                title: this.data.title
              }
            })
          } else if (this.data.type === 3){
             this.popupMenu = this.popup({
              title: '请选择添加图书的方式',
              local: true,
              btn: [
                // this.createPopupBtn('导入本地图书', () => {
                //   console.log('test')
                // }, 'danger'),
                this.createPopupBtn('前往书城添加', () => {
                  gotoStoreHome(this)
                }),
                this.createPopupBtn('取消', () => {
                    this.hidePopup()
                  })
              ]
            }).show()
            // gotoStoreHome(this) // 3：展示书城首页
          } else { // 4: 直接阅读
              // 传入书名在indexDB中查找该书籍
              this.$router.push({
                path: `/ebook/local|${this.data.fileName}`
              })
          }
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .shelf-item {
    position: relative;
    width: 100%;
    height: 100%;
    // 当type为1和2（默认和分类）时，显示阴影
    &.shelf-item-shadow {
      box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, .3);
    }
    .shelf-item-comp {
      opacity: 1;
      // 编辑模式下，分类组的封面透明度减少
      &.is-edit {
        opacity: .5;
      }
    }
    // 编辑模式下出现的图标
    .icon-selected {
      position: absolute;
      bottom: px2rem(2);
      right: px2rem(2);
      font-size: px2rem(18);
      color: rgba(0, 0, 0, .4);
      // 选中时的样式
      &.is-selected {
        color: $color-blue;
      }
    }
  }
</style>
