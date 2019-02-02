import CreateAPI from 'vue-create-api'
import Vue from 'vue'
import Toast from '../components/common/Toast'
import Popup from '../components/common/Popup'
// import GroupDialog from '../components/shelf/ShelfGroupDialog'

Vue.use(CreateAPI)
Vue.createAPI(Toast, true)
Vue.createAPI(Popup, true)
// Vue.createAPI(GroupDialog, true)
Vue.mixin({
  methods: {
    // 提示消息1（1.5秒就消失）
    toast(settings) {
      return this.$createToast({
        $props: settings
      })
    },
    // 底层弹出框
    popup(settings) {
      return this.$createPopup({
        $props: settings
      })
    },
    // 提示消息2（1的进一步简化版）
    simpleToast(text) {
      const toast = this.toast({
        text: text
      })
      toast.show()
      toast.updateText(text)
    },
    // dialog(settings) {
    //   return this.$createGroupDialog({
    //     $props: settings
    //   })
    // }
  }
})
