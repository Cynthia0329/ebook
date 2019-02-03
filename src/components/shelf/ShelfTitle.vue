<template>
  <transition name="fade">
    <div class="shelf-title" :class="{'hide-shadow': ifHideShadow}" v-show="shelfTitleVisible">

      <!-- type1：书架页面 -->
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
      
      <!-- type2：分组页面 -->
      <!-- 左侧返回按钮 -->
      <div class="shelf-title-btn-wrapper shelf-title-left" v-if="showBack">
        <span class="icon-back" @click="back"></span>
      </div>
      <!-- 编辑模式下显示：修改分组 -->
      <div class="shelf-title-btn-wrapper"
           :class="{'shelf-title-left': changeGroupLeft, 'shelf-title-right': changeGroupRight}" @click="changeGroup"
           v-if="showChangeGroup">
        <span class="shelf-title-btn-text">{{$t('shelf.editGroup')}}</span>
      </div>
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
      emptyCategory() {
        return !this.shelfCategory || !this.shelfCategory.itemList || this.shelfCategory.itemList.length === 0
      },

      // 书架页面或者不为空的分组页面中：显示编辑按钮
      showEdit() {
        return this.currentType === 1 || !this.emptyCategory
      },
      
      // 当type为1，即书架页面的时候显示清空按钮
      showClear() {
        return this.currentType === 1
      },
      // 当type为2，即分组页面的时候显示返回按钮（并且非编辑模式下）
      showBack() {
        return this.currentType === 2 && !this.isEditMode
      },
      // 编辑模式下左侧显示：修改分组 
      showChangeGroup() {
        return this.currentType === 2 && (this.isEditMode || this.emptyCategory)
      },
      // 当前分组不为空的时候，修改分组显示在左边
      changeGroupLeft() {
        return !this.emptyCategory
      },
      // 当前分组为空的时候，修改分组显示在右边
      changeGroupRight() {
        return this.emptyCategory
      },

      // 编辑模式选中下的副标题
      selectedText() {
        // 获取选中图书的数量
        const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0
        // 根据数量返回不同的副标题（第二层判断是针对英文的单复数，中文状态下没有区别）
        return selectedNumber <= 0 ? this.$t('shelf.selectBook') : (selectedNumber === 1 ? this.$t('shelf.haveSelectedBook').replace('$1', selectedNumber) : this.$t('shelf.haveSelectedBooks').replace('$1', selectedNumber))
      },

      popupCancelBtn() {
        return this.createPopupBtn(this.$t('shelf.cancel'), () => {
          this.hidePopup()
        })
      }
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
      // 隐藏弹出框=>删除当前分组=>更新书架列表=>返回书架列表=>设置编辑状态为false
      onComplete() {
        this.hidePopup()
        this.setShelfList(this.shelfList.filter(book => book.id !== this.shelfCategory.id)).then(() => {
          saveBookShelf(this.shelfList)
          this.$router.go(-1)
          this.setIsEditMode(false)
        })
      },
      // 删除当前分组
      deleteGroup() {
        if (!this.emptyCategory) {
          // 将分组内的所有图书移出分组
          this.setShelfSelected(this.shelfCategory.itemList)
          this.moveOutOfGroup(this.onComplete)
        } else {
          this.onComplete()
        }
      },
      // 修改当前分组的名字
      changeGroupName() {
        this.hidePopup()
        this.dialog({
          showNewGroup: true,
          groupName: this.shelfCategory.title,
          new_title: '修改分组名'
        }).show()
      },
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
      // 点击删除当前分组
      showDeleteGroup() {
        this.hidePopup()
        setTimeout(() => {
          this.popupMenu = this.popup({
            title: this.$t('shelf.deleteGroupTitle'),
            btn: [
              this.createPopupBtn(this.$t('shelf.confirm'), () => {
                this.deleteGroup()
              }, 'danger'),
              this.popupCancelBtn
            ]
          }).show()
        }, 200)
      },
      // 点击修改分组=>显示弹出框=>点击触发不同的事件
      changeGroup() {
        this.popupMenu = this.popup({
          btn: [
            this.createPopupBtn(this.$t('shelf.editGroupName'), () => {
              this.changeGroupName()
            }),
            this.createPopupBtn(this.$t('shelf.deleteGroup'), () => {
              this.showDeleteGroup()
            }, 'danger'),
            this.popupCancelBtn
          ]
        }).show()
      },
      // 点击返回按钮
      back() {
        this.$router.go(-1)
        this.setIsEditMode(false)
      },

      // 点击编辑按钮
      onEditClick() {
        if (!this.isEditMode) {
          // 初始化选择的图书列表数组
          this.setShelfSelected([])
          // 将图书的选中状态全部设置为false
          this.shelfList.forEach(item => {
            item.selected = false
            // 当item.itemList存在：即当前页尾分组页的时候
            if (item.itemList) {
              // 也将图书的选中状态全部设置为false
              item.itemList.forEach(subItem => {
                subItem.selected = false
              })
            }
          })
        }
        // 每次点击都更新编辑模式状态
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
