<template>
  <div class="mainBox" ref="mainBox">
    <mu-appbar class="headerBar"
               title="留言板"
               textColor="#333333"
               color="#ffffff">
      <mu-button icon slot="left" to="/My">
        <mu-icon value="arrow_back_ios" size="26" color="#999"></mu-icon>
      </mu-button>
    </mu-appbar>
    <div class="mainBox-load-more"
         ref="mainBoxLoadMore"
         :style="{height:loadingHeight + `px`}">
      <mu-container
        class="g-setData"
        v-if="!isShowGBook">
        <mu-form ref="form" :model="validateForm" class="mu-demo-form">
          <mu-form-item label="片名" prop="gbook_content" :rules="gbook_contentRules">
            <mu-text-field v-model="validateForm.gbook_content" prop="gbook_content"></mu-text-field>
          </mu-form-item>
          <mu-form-item label="验证码" prop="verify" :rules="verifyRules">
            <mu-text-field type="text" v-model="validateForm.verify" prop="verify">
                <mu-button flat @click="getVerify(1)">
                  <img :src="verifyImg" v-if="freshVerify">
                </mu-button>
            </mu-text-field>
          </mu-form-item>
          <mu-form-item>
            <mu-flex class="flex-wrapper" align-items="center" justify-content="center" fill>
              <mu-button large @click="clear">返回</mu-button>
              <mu-button large color="success" @click="submit">提交</mu-button>
            </mu-flex>
          </mu-form-item>
        </mu-form>
      </mu-container>
      <mu-load-more @refresh="renderData(2)"
                    v-if="isShowGBook"
                    :refreshing="refreshing"
                    :loading="loading"
                    :loading-text="loadingText"
                    :loaded-all="loadedAll"
                    @load="load">
        <mu-list>
          <mu-list-item
            class="g-list"
            v-for="(item, index) in listData"
            :key="item.id">
            <mu-list-item-content>
                <span class="g-list-index">
                  {{'第' + JSON.stringify(index + 1) + '条'}}
                </span>
              <p>
                <span class="g-list-name">{{item.gbook_name}}</span>: <b>{{item.gbook_content}}</b>
              </p>
              <mu-list-item-sub-title>{{item.gbook_time | filterDate}}</mu-list-item-sub-title>
              <p v-if="item.gbook_reply" class="g-list-reply">
                <span class="g-list-name">站长回复</span>: <b>{{item.gbook_reply}}</b>
                <mu-list-item-sub-title>{{item.gbook_reply_time | filterDate}}</mu-list-item-sub-title>
              </p>
            </mu-list-item-content>
          </mu-list-item>
        </mu-list>
      </mu-load-more>
    </div>
    <mu-flex
      justify-content="center"
      v-if="isShowGBook"
      align-items="center" style="height: 56px">
      <mu-button color="primary" @click="isShowGBook = !isShowGBook">
        <mu-icon left value="edit"></mu-icon>
        留言
      </mu-button>
    </mu-flex>
  </div>
</template>

<script>import { HomeSrv } from '@/service'
import Tool from '@/utils/tools'
export default {
  name: 'GBook',
  data () {
    return {
      refreshing: false,
      loading: false,
      loadingText: '轻松加载中...',
      loadedAll: false,
      ajaxData: {
        page: 1,
        limit: 15
      },
      listData: [],
      isShowGBook: true,
      gbook_contentRules: [
        {validate: (val) => !!val, message: '必须填写片名'}
      ],
      verifyRules: [
        {validate: (val) => !!val, message: '必须填写验证码'}
      ],
      validateForm: {
        gbook_content: '',
        verify: ''
      },
      verifyImg: '',
      freshVerify: true
    }
  },
  inject: ['HEIGHT'],
  filters: {
    filterDate: function (v) {
      return Tool.FormatDate(v)
    }
  },
  computed: {
    loadingHeight: function () {
      return this.setLoadingHeight() - 124
    }
  },
  mounted () {
    this.renderData(2)
    this.getVerify()
    console.log('gbook')
  },
  methods: {
    closeIt () {
      this.$emit('on-close', false)
    },
    load () {
      this.ajaxData.page = this.ajaxData.page + 1
      this.renderData(1)
    },
    renderData (t) {
      if (t === 2) this.ajaxData.page = 1
      this.getListData(Object.assign({}, this.ajaxData), t)
    },
    submit () {
      let that = this
      let formdata = new FormData()
      formdata.append('gbook_content', that.validateForm.gbook_content)
      formdata.append('verify', that.validateForm.verify)
      that.$refs.form.validate().then((result) => {
        console.log('form valid: ', result)
        if (result) {
          HomeSrv.GBookSaveDataApi(formdata).then((res) => {
            if (res.code === 1) {
              that.$toast.success(res.msg)
              setTimeout(function () {
                that.clear()
              }, 1000)
            } else {
              that.$toast.message(res.msg)
            }
          })
        }
      })
    },
    clear () {
      this.$refs.form.clear()
      this.isShowGBook = true
      this.validateForm = {
        gbook_content: '',
        verify: ''
      }
      this.renderData(2)
    },
    getVerify (t) {
      let that = this
      if (t === 1) {
        that.verifyImg = ''
        setTimeout(function () {
          that.verifyImg = HomeSrv.getVerifyApi
        }, 10)
      } else {
        that.verifyImg = HomeSrv.getVerifyApi
      }
    },
    getListData (data, type) {
      let that = this
      if (type === 1) {
        this.loading = true
      } else {
        this.refreshing = true
        that.loadedAll = false
      }
      HomeSrv.getGBookDataApi(data).then((res) => {
        if (type === 1) {
          that.loading = false
          if (res.list && res.list.length > 0) {
            res.list.map((i) => {
              that.listData.push(i)
            })
            that.loadingText = '轻松加载中...'
          } else {
            that.ajaxData.page = this.ajaxData.page
            that.loadedAll = true
            that.loadingText = '留言全部加载.'
            that.$toast.info('留言全部加载', {
              position: 'bottom'
            })
          }
        } else {
          this.listData = []
          this.listData = res.list
          this.ajaxData.page = 1
          this.refreshing = false
          this.loadingText = '轻松加载中...'
          that.loading = false
          console.log('1212')
          if (res.list.length === 0) {
            this.$toast.info('暂无数据', {
              position: 'bottom'
            })
          }
        }
      })
    },
    setLoadingHeight () {
      return this.HEIGHT() - 56
    }
  }
}
</script>

<style scoped>
  .mainBox {
    height: 100%;
    flex: 1;
    touch-action: none;
    -webkit-overflow-scrolling: touch;
  }
  .mainBox-load-more{
    flex: 1;
    overflow: auto;
    touch-action: none;
    -webkit-overflow-scrolling: touch;
  }
</style>
