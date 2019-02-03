<template>
  <ebook-dialog :title="title" ref="dialog">
    <!-- 第一个插槽自定义的div模块开始 -->
    <div class="dialog-list-wrapper" v-if="!ifNewGroup">
      <div class="dialog-list-item"
           :class="{'is-add': item.edit  ? item.edit === 1 : false}"
           v-for="(item, index) in categoryList"
           :key="index"
           @click="onGroupClick(item)"
           v-if="(item.edit === 2 && isInGroup) || item.edit !== 2 || !item.edit">
        <div class="dialog-list-item-text">{{ item.title }}</div>
        <div class="dialog-list-icon-wrapper" v-if="isInGroup && shelfCategory.id === item.id">
          <span class="icon-check"></span>
        </div>
      </div>
    </div>
    <!-- 点击新建分组 -->
    <div class="dialog-new-group-wrapper" v-else>
      <div class="dialog-input-title-wrapper">
        <span class="dialog-input-title">{{$t('shelf.groupName')}}</span>
      </div>
      <div class="dialog-input-wrapper">
        <div class="dialog-input-inner-wrapper">
          <input type="text" class="dialog-input" v-model="newGroupName" ref="dialogInput">
          <div class="dialog-input-clear-wrapper" @click="clear" v-show="newGroupName && newGroupName.length > 0">
            <span class="icon-close-circle-fill"></span>
          </div>
        </div>
      </div>
    </div>
    <!-- 第一个插槽自定义的div模块结束 -->

    <!-- 第二个插槽自定义的div模块 -->
    <div slot="btn" class="group-dialog-btn-wrapper">
      <div class="dialog-btn" @click="hide">{{$t('shelf.cancel')}}</div>
      <div class="dialog-btn" @click="createNewGroup" :class="{'is-empty': newGroupName && newGroupName.length === 0}"
           v-if="ifNewGroup">{{$t('shelf.confirm')}}
      </div>
    </div>
  </ebook-dialog>
</template>

<script>
  import EbookDialog from '../common/Dialog'
  import { storeShelfMixin } from '../../utils/mixin'
  import { removeAddFromShelf, appendAddToShelf } from '../../utils/store'
  import { saveBookShelf } from '../../utils/localStorage'

  export default {
    name: 'group-dialog',
    mixins: [storeShelfMixin],
    components: {
      EbookDialog
    },
    props: {
      showNewGroup: {
        type: Boolean,
        default: false
      },
      groupName: String
    },
    computed: {
      // 判断当前操作是否在分组内
      isInGroup() {
        return this.currentType === 2
      },
      // 默认分类
      defaultCategory() {
        return [
          {
            title: this.$t('shelf.newGroup'),
            edit: 1
          },
          {
            title: this.$t('shelf.groupOut'),
            edit: 2
          }
        ]
      },
      // 书架中已建的分组名列表
      category() {
        return this.shelfList.filter(item => item.type === 2)
      },
      // 对话框列表数据
      categoryList() {
        return [...this.defaultCategory, ...this.category]
      },
      // 动态显示对话框的标题
      title() {
        return !this.ifNewGroup ? this.$t('shelf.moveBook') : this.$t('shelf.newGroup')
      }
    },
    data() {
      return {
        ifNewGroup: false,
        newGroupName: ''
      }
    },
    methods: {
      show() {
        this.ifNewGroup = this.showNewGroup
        this.newGroupName = this.groupName
        this.$refs.dialog.show()
      },
      hide() {
        this.$refs.dialog.hide()
        setTimeout(() => {
          this.ifNewGroup = false
        }, 200)
      },
      // 点击对话框的按钮，调用不同的方法
      onGroupClick(item) {
        if (item.edit && item.edit === 1) {
          this.ifNewGroup = true
        } else if (item.edit && item.edit === 2) {
          this.moveOutFromGroup(item)
        } else {
          this.moveToGroup(item)
        }
      },
      // 清空新建分组的输入框
      clear() {
        this.newGroupName = ''
      },
      // 将选择的图书移动xxx分组中
      moveToGroup(group) {
        // 更新书架上的书籍（还剩余的书籍）
        this.setShelfList(this.shelfList
          .filter(book => { // 将选择的书籍从书架列表中过滤掉
            if (book.itemList) { // book.itemList？？？这啥
              book.itemList = book.itemList.filter(subBook => this.shelfSelected.indexOf(subBook) < 0)
            }
            return this.shelfSelected.indexOf(book) < 0
          }))
          .then(() => { // 更新分组中的书籍
            if (group && group.itemList) { // 合并分组中已有的书籍和选择的书籍
              group.itemList = [...group.itemList, ...this.shelfSelected]
            }
            // 通过给index赋值，达到添加的电子书按顺序排列在已添加电子书的后面的效果
            group.itemList.forEach((item, index) => { 
              item.id = index + 1
            })
            // 弹出移动成功的提示框
            this.simpleToast(this.$t('shelf.moveBookInSuccess').replace('$1', group.title))
            // 完毕
            this.onComplete()
          })
      },
      // 将图书从分组中移出
      moveOutFromGroup() {
        this.moveOutOfGroup(this.onComplete)
      },
      // 新建分组
      createNewGroup() {
        // 首先判断分组名是否为空
        if (!this.newGroupName || this.newGroupName.length === 0) {
          return
        }
        if (this.showNewGroup) { //？？？
          this.shelfCategory.title = this.newGroupName
          this.onComplete()
        } else { // 新建一个分组对象
          const group = {
            id: this.shelfList[this.shelfList.length - 2].id + 1,
            itemList: [],
            selected: false,
            title: this.newGroupName,
            type: 2
          }
          // 将分组对象新添加到书架列表中（下面这几步是为了保证+在最后）
          let list = removeAddFromShelf(this.shelfList)
          list.push(group)
          list = appendAddToShelf(list)
          // 更新书架列表 => 将选择的图书移动xxx分组中
          this.setShelfList(list).then(() => {
            this.moveToGroup(group)
          })
        }
      },
      // 更新书架的书籍状态信息=>隐藏对话框=>关闭编辑模式
      onComplete() {
        saveBookShelf(this.shelfList)
        this.hide()
        this.setIsEditMode(false)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .dialog-list-wrapper {
    width: 100%;
    padding: 0 px2rem(20);
    box-sizing: border-box;
    font-size: px2rem(14);
    @include scroll;
    .dialog-list-item {
      display: flex;
      padding: px2rem(15) 0;
      box-sizing: border-box;
      color: #666;
      &.is-add {
        color: $color-blue;
        &:active {
          color: $color-blue-transparent;
        }
      }
      &:active {
        color: rgba(102, 102, 102, .5)
      }
      .dialog-list-item-text {
        flex: 1;
      }
      .dialog-list-icon-wrapper {
        flex: 0 0 px2rem(30);
        color: $color-blue;
        @include right;
      }
    }
  }

  .dialog-new-group-wrapper {
    width: 100%;
    padding: 0 px2rem(20);
    box-sizing: border-box;
    .dialog-input-title-wrapper {
      font-size: px2rem(10);
      margin-top: px2rem(20);
    }
    .dialog-input-wrapper {
      width: 100%;
      padding: 0 0 px2rem(30) 0;
      box-sizing: border-box;
      .dialog-input-inner-wrapper {
        display: flex;
        width: 100%;
        padding: px2rem(10) 0;
        box-sizing: border-box;
        border-bottom: px2rem(1) solid #eee;
        font-size: px2rem(14);
        color: #666;
        .dialog-input {
          flex: 1;
          border: none;
          &:focus {
            outline: none;
          }
        }
        .dialog-input-clear-wrapper {
          flex: 0 0 px2rem(30);
          color: #ccc;
          @include center;
          &:active {
            color: #999;
          }
        }
      }
    }
  }

  .group-dialog-btn-wrapper {
    width: 100%;
    @include center;
  }

  .dialog-btn {
    flex: 1;
    &.is-empty {
      color: rgba(255, 255, 255, .5);
    }
    &:active {
      color: rgba(255, 255, 255, .5)
    }
  }
</style>
