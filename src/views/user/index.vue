<template>
  <div class="user">
    <div class="user-top">
      <div class="head-icon-wrapper">
        <span class="icon-person"></span>
      </div>
    </div>
    <footer-button :currentTab="3"></footer-button>
    <p>用户阅读总时长： {{ getReadTimeText() }}</p>
    <p>用户目前的积分：{{ nowIntegral }} 分 </p>
    <mt-button type="danger" @click.native="showPopu">兑换</mt-button>
    <p>用户目前所拥有的下载券：{{ ticket }} 张</p>
    
    <!-- <p>请选择你要兑换的下载券</p> -->
    <mt-popup
      v-model="popupVisible"
      popup-transition="popup-fade"
      position="bottom">
        <mt-picker :slots="dataList"  :visible-item-count="5"  :show-toolbar="true" ref="picker" value-key="cName" :visibleItemCount="3">
          <p>请选择你要兑换的张数：</p>
        </mt-picker>
        <br>
        <mt-button type="danger" @click.native="handleConfirm" size="large">确定</mt-button>
    </mt-popup>

    <mt-switch v-model="onOff">是否开启护眼模式</mt-switch>


  </div>
</template>

<script>
  import FooterButton from '../../components/common/FooterButton'
  import { getLocalStorage, setLocalStorage, getReadTime, saveIntegralCache, saveDownTicket, getDownTicket, getBookShelf } from '../../utils/localStorage'
  import { ebookMixin, storeUserMixin } from '../../utils/mixin'
  import { localToServer } from '../../api/user'
  import qs from 'qs'

  import { Popup, Toast, Switch  } from 'mint-ui'
import { shelf } from '../../api/store';


  export default {
    mixins: [ebookMixin, storeUserMixin],
    data() {
      return {
        popupVisible: false,
        downTags: '',
        currentTags: '',
        integralUsed: '', // 消耗的积分
        nowIntegral: '',
        dataList: [ // 弹窗的数据列表
          {
            values: ['1', '2', '3', '4', '5'],
            className: 'slot1',
            textAlign: 'center'
          }, {
              divider: true,
              content: '张',
              className: 'slot2'
            }
        ],
        ticket: '', // 下载券
        onOff: true
      }
    },
    components: {
      FooterButton
    },
    watch: {
      // 监听switch的改变（开启和关闭护眼模式）
      onOff(value) {
        this.setEyeSet(this.onOff)
        if (!value) {
          this.setSafeTime(0)
        }
      }
    },
    methods: {

      // 遍历localStorage的数据保存在数组中
        AllLocalStorage() {
          let data = []
          for (var i = localStorage.length - 1; i >= 0; i--) {
            var key = localStorage.key(i)
            var keyValue = localStorage.getItem(localStorage.key(i))
            // var keyValue = getLocalStorage(key)
            // console.log(key)
            // console.log(keyValue)
            // this.testID.key = keyValue
            localToServer(key, keyValue)
              .then(res => {
                if (res && res.status === 200) {
                  console.log(res.data)
                } else {
                  alert('客户端失败')
                }
              })
          }
          return data
        },

        // 兑换积分popu框事件
        handleConfirm () {
          // 获取弹窗的张数
          this.currentTags = this.$refs.picker.getValues()[0]
          console.log('当前选择的张数：')
          console.log(this.currentTags);

          // 判断剩余的积分是否足够兑换xx张数的下载券
          if (this.nowIntegral < this.currentTags*100) {
            Toast({
                  message: '请选择重新当前积分足够兑换的下载券张数',
                  duration: 1500
                })
          } else {
            // 兑换后，消耗积分增加（更新本地中的消耗积分数据）
              let newIntegral = parseInt(this.integralUsed) + parseInt(this.currentTags)*100
              saveIntegralCache(newIntegral)

              console.log('消耗的总积分')
              console.log(this.getIntegral())

              // 更新消耗值之后再次计算当前剩余的积分
              this.computeIntegral()
              console.log('当前剩余的积分')
              console.log(this.nowIntegral)

              // 兑换后，下载券增加
              this.ticket = parseInt(getDownTicket()) + parseInt(this.currentTags)
              saveDownTicket(this.ticket)
              this.popupVisible = false
          }
          

          
        },

        // 计算当前剩余积分：总积分（由总时长转换）- 消耗积分
        computeIntegral() {
          // 获取消耗的积分
          this.integralUsed = this.getIntegral()
          this.nowIntegral = Math.floor((parseInt(getReadTime()) / 360) - this.integralUsed)
        },

        // 点击兑换
        showPopu() {
          if (this.nowIntegral < 100) {
            Toast({
                  message: '当前的积分无法兑换下载阅读券，请继续累积阅读时长',
                  duration: 1500
                })
          } else {
            this.popupVisible = true
          }
        }

        
      
    },
    mounted() {
      // 计算当前剩余的积分
      this.computeIntegral()
      // 获取当前的下载券
      this.ticket = this.getTicket()
      // 获取当前的护眼设置
      this.onOff = this.eyeSet
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .user {
    height: 100%;
    .user-top {
      width: 100%;
      height: 30%;
      border-bottom: 10px solid #000;
      display: flex;
      justify-content: center;
      .head-icon-wrapper {
        width: 10px;
        height: 10px;
      }
    }
  }
  p {
    font-size: px2rem(20);
    padding-top: px2rem(10);
  }

  .mint-popup.mint-popup-bottom {
      width: 100%;
  }

  .mint-toast {
      width: 80% !important;
      line-height: px2rem(20);
  }
</style>
