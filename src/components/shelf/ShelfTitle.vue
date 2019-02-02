<template>
  <transition name="fade">
    <div class="shelf-title" :class="{'hide-shadow': ifHideShadow}" v-show="shelfTitleVisible">
      <!-- 书架标题 -->
      <div class="shelf-title-text-wrapper">
        <span class="shelf-title-text">{{ title }}</span>
        <span class="shelf-title-sub-text" v-show="isEditMode">{{ selectedText }}</span>
      </div>
      <!-- 清除缓存 -->
      <div class="shelf-title-btn-wrapper shelf-title-left" v-if="showClear">
        <span class="shelf-title-btn-text" @click="clearCache">{{$t('shelf.clearCache')}}</span>
      </div>
      <!-- 编辑 -->
      <div class="shelf-title-btn-wrapper shelf-title-right" v-if="showEdit">
        <span class="shelf-title-btn-text"
              @click="onEditClick">{{ isEditMode ? $t('shelf.cancel') : $t('shelf.edit') }}</span>
      </div>
      <!-- <div class="shelf-title-btn-wrapper shelf-title-left" v-if="showBack">
        <span class="icon-back" @click="back"></span>
      </div> -->
      <!-- <div class="shelf-title-btn-wrapper"
           :class="{'shelf-title-left': changeGroupLeft, 'shelf-title-right': changeGroupRight}" @click="changeGroup"
           v-if="showChangeGroup">
        <span class="shelf-title-btn-text">{{$t('shelf.editGroup')}}</span>
      </div> -->
    </div>
  </transition>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import { clearLocalStorage, saveBookShelf } from '../../utils/localStorage'
  import { clearLocalForage } from '../../utils/localForage'

  export default {
    mixins: [storeShelfMixin],
    props: {
      title: String
    },
    computed: {
      // emptyCategory() {
      //   return !this.shelfCategory || !this.shelfCategory.itemList || this.shelfCategory.itemList.length === 0
      // },

      // 待
      showEdit() {
        // return this.currentType === 1 || !this.emptyCategory
        return true
      },
      
      // 待
      showClear() {
        return true
        // return this.currentType === 1
      },
      // showBack() {
      //   return this.currentType === 2 && !this.isEditMode
      // },
      // showChangeGroup() {
      //   return this.currentType === 2 && (this.isEditMode || this.emptyCategory)
      // },
      // changeGroupLeft() {
      //   return !this.emptyCategory
      // },
      // changeGroupRight() {
      //   return this.emptyCategory
      // },

      // 编辑模式选中下的副标题
      selectedText() {
        // 获取选中图书的数量
        const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0
        // 根据数量返回不同的副标题（第二层判断是针对英文的单复数，中文状态下没有区别）
        return selectedNumber <= 0 ? this.$t('shelf.selectBook') : (selectedNumber === 1 ? this.$t('shelf.haveSelectedBook').replace('$1', selectedNumber) : this.$t('shelf.haveSelectedBooks').replace('$1', selectedNumber))
      },

      // popupCancelBtn() {
      //   return this.createPopupBtn(this.$t('shelf.cancel'), () => {
      //     this.hidePopup()
      //   })
      // }
    },
    watch: {
      // 监听Y轴偏移量，判断标题栏是否显示阴影
      offsetY(offsetY) {
        if (offsetY > 0) {
          this.ifHideShadow = false
        } else {
          this.ifHideShadow = true
        }
      }
    },
    data() {
      return {
        ifHideShadow: true
      }
    },
    methods: {
    //   onComplete() {
    //     this.hidePopup()
    //     this.setShelfList(this.shelfList.filter(book => book.id !== this.shelfCategory.id)).then(() => {
    //       saveBookShelf(this.shelfList)
    //       this.$router.go(-1)
    //       this.setIsEditMode(false)
    //     })
    //   },
    //   deleteGroup() {
    //     if (!this.emptyCategory) {
    //       this.setShelfSelected(this.shelfCategory.itemList)
    //       this.moveOutOfGroup(this.onComplete)
    //     } else {
    //       this.onComplete()
    //     }
    //   },
    //   changeGroupName() {
    //     this.hidePopup()
    //     this.dialog({
    //       showNewGroup: true,
    //       groupName: this.shelfCategory.title
    //     }).show()
    //   },
    //   hidePopup() {
    //     this.popupMenu.hide()
    //   },
    //   createPopupBtn(text, onClick, type = 'normal') {
    //     return {
    //       text: text,
    //       type: type,
    //       click: onClick
    //     }
    //   },
    //   showDeleteGroup() {
    //     this.hidePopup()
    //     setTimeout(() => {
    //       this.popupMenu = this.popup({
    //         title: this.$t('shelf.deleteGroupTitle'),
    //         btn: [
    //           this.createPopupBtn(this.$t('shelf.confirm'), () => {
    //             this.deleteGroup()
    //           }, 'danger'),
    //           this.popupCancelBtn
    //         ]
    //       }).show()
    //     }, 200)
    //   },
    //   changeGroup() {
    //     this.popupMenu = this.popup({
    //       btn: [
    //         this.createPopupBtn(this.$t('shelf.editGroupName'), () => {
    //           this.changeGroupName()
    //         }),
    //         this.createPopupBtn(this.$t('shelf.deleteGroup'), () => {
    //           this.showDeleteGroup()
    //         }, 'danger'),
    //         this.popupCancelBtn
    //       ]
    //     }).show()
    //   },
    //   back() {
    //     this.$router.go(-1)
    //     this.setIsEditMode(false)
    //   },

      // 点击编辑按钮
      onEditClick() {
        if (!this.isEditMode) {
          // 初始化选择的图书列表数组
          this.setShelfSelected([])
          // 将图书的选中状态全部设置为false
          this.shelfList.forEach(item => {
            item.selected = false
            // ？？？
            if (item.itemList) {
              item.itemList.forEach(subItem => {
                subItem.selected = false
              })
            }
          })
        }
        this.setIsEditMode(!this.isEditMode)
      },

      // 清除缓存
      clearCache() {
        clearLocalStorage()
        clearLocalForage()
        this.setShelfList([])
        this.setShelfSelected([])
        this.getShelfList()
        this.simpleToast(this.$t('shelf.clearCacheSuccess'))
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .shelf-title {
    position: relative;
    z-index: 130;
    width: 100%;
    height: px2rem(42);
    background: white;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
    &.hide-shadow {
      box-shadow: none;
    }
    // 书架标题栏中心文本
    .shelf-title-text-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: px2rem(42);
      @include columnCenter;
      .shelf-title-text {
        font-size: px2rem(16);
        line-height: px2rem(20);
        font-weight: bold;
        color: #333;
      }
      .shelf-title-sub-text {
        font-size: px2rem(10);
        color: #333;
      }
    }
    // 书架标题栏左右的按钮
    .shelf-title-btn-wrapper {
      position: absolute;
      top: 0;
      box-sizing: border-box;
      height: 100%;
      @include center;
      .shelf-title-btn-text {
        font-size: px2rem(14);
        color: #666;
      }
      .icon-back {
        font-size: px2rem(20);
        color: #666;
      }
      // 左侧按钮
      &.shelf-title-left {
        left: 0;
        padding-left: px2rem(15);
      }
      // 右侧按钮
      &.shelf-title-right {
        right: 0;
        padding-right: px2rem(15);
      }
    }
  }
</style>
