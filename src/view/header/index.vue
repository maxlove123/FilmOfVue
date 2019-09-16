<template>
  <div class="header">
    <mu-appbar class="headerBar"
               :color="backgroundColor || bgColor"
               :textColor="textColor">
      <!--<div slot="left" @click="openDrawer">-->
        <!--<mu-icon value="menu"></mu-icon>-->
      <!--</div>-->
      <span>{{title}}</span>
      <mu-flex align-items="center" slot="right" justify-content="around">
        <mu-icon value="search"
                 @click="goSearch"
                 size="30" :color="textColor"></mu-icon>
      </mu-flex>
    </mu-appbar>
  </div>
</template>

<script>export default {
  name: 'mHeader',
  data () {
    return {
      title: '视频',
      showList: 1,
      bgColor: 'transparent',
      textColor: '#ffffff',
      logoImg: require('@/assets/logo.png'),
      searchScreen: false
    }
  },
  computed: {
    active () {
      return this.$store.state.cache.tabActive
    }
  },
  props: {
    backgroundColor: {
      type: String
    }
  },
  methods: {
    openDrawer () {
      this.$emit('open')
    },
    goSearch () {
      this.$router.push({
        path: 'List'
      })
    },
    tabChange (v) {
      this.$store.dispatch('setTabActive', v)
    }
  }
}
</script>

<style scoped>
  .mu-tab {
    min-width: 55px;
    width: 57px;
    transition-duration: .12s;
    white-space: nowrap;
    color: #fafafa;
    font-size: 16px;
  }
  .mu-tab.mu-tab-active {
    color: #fff;
    font-size: 20px;
    font-weight: 800;
  }
  .header{
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#000000), color-stop(100%,rgba(255, 255, 255, 0)));
    background: -webkit-linear-gradient(top, #000000 0%,rgba(255, 255, 255, 0) 100%);
    background: linear-gradient(to bottom, #000000 0%,rgba(255, 255, 255, 0) 100%);
    top: 0;
    display: flex;
    position: fixed;
    width: 100%;
    z-index: 99999;
  }
  .headerBar {
    width: 100%;
    box-shadow: none;
  }
  .mLogo {
    height: 40px;
    vertical-align: middle;
    margin-left: 5px;
  }
</style>
