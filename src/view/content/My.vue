<template>
  <div>
    <mu-flex class="flex-wrapper" fill align-items="center" justify-content="center">
      <mu-list>
        <mu-list-item button :ripple="false" to="/GBook">
          <mu-list-item-action>
            <mu-icon value="question_answer"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>留言/反馈</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button :ripple="false" to="/ListRecord">
          <mu-list-item-action>
            <mu-icon value="query_builder"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>观看记录</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button :ripple="false" @click="clearCache">
          <mu-list-item-action>
            <mu-icon value="repeat"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>清除缓存</mu-list-item-title>
          <mu-list-item-action>
            {{cacheSize}}
          </mu-list-item-action>
        </mu-list-item>
        <!--<mu-list-item button :ripple="false" @click="statement">-->
          <!--<mu-list-item-action>-->
            <!--<mu-icon value="import_contacts"></mu-icon>-->
          <!--</mu-list-item-action>-->
          <!--<mu-list-item-title>免责声明</mu-list-item-title>-->
        <!--</mu-list-item>-->
      </mu-list>
    </mu-flex>
  </div>
</template>

<script>export default {
  name: 'My',
  data () {
    return {
      cacheSize: ''
    }
  },
  mounted () {
    this.getCacheSize()
  },
  activated () {
    this.getCacheSize()
  },
  methods: {
    goGBook () {},
    goRecord () {},
    clearCache () {
      let that = this
      api.clearCache(function () {
        api.toast({
          msg: '清除完成'
        })
      })
      that.getCacheSize()
    },
    getCacheSize () {
      let that = this
      api.getCacheSize(function (ret, err) {
        let size = parseInt(ret.size / 1024) + 'KB'
        if (parseInt(ret.size / 1024) > 1024) {
          that.cacheSize = parseInt(ret.size / (1024 * 1024)) + 'MB'
        } else {
          that.cacheSize = size
        }
      })
    },
    checkUpdate () {
      var mam = api.require('mam')
      mam.checkUpdate(function (ret, err) {
        if (ret && ret.status) {
          if (!ret.result.update) {
            api.alert({
              title: '版本更新',
              msg: '当前已是最新版本，版本号：' + api.appVersion
            })
          } else {
            api.confirm({
              title: '有新版本',
              msg: '已发布最新版本，建议您尽快更新。版本号：' + ret.result.version,
              buttons: ['马上更新', '以后再说']
            }, function (ret, err) {
              if (ret.buttonIndex === 1) {
                alert('点击了马上更新')
              }
            })
          }
        }
      })
    },
    statement () {}
  }
}
</script>

<style scoped>

</style>
