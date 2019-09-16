<template>
  <div class="footer">
    <mu-container  style="max-width: 100%; width:100%;padding: 0">
      <mu-bottom-nav :value.sync="shift" class="qk-dark">
        <mu-bottom-nav-item
          :ripple="false"
          :title="item.title"
          :value="item.title"
          :to="item.to"
          :key="index"
          v-for="(item,index) in Array.from(menuList)"
          :icon="item.icon"></mu-bottom-nav-item>
      </mu-bottom-nav>
    </mu-container>
  </div>
</template>

<script>export default {
  name: 'mFooter',
  data () {
    return {
      shift: '首页',
      menuList: [
        {
          to: '/HomeBox',
          on: 'HomeBox',
          icon: 'home',
          title: '首页'
        },
        {
          to: '/FilterBox',
          on: 'FilterBox',
          icon: 'apps',
          title: '片库'
        },
        {
          to: '/My',
          on: 'My',
          icon: 'toys',
          title: '我的'
        }
      ]
    }
  },
  watch: {
    '$route': function (to, from) {
      this.shift = to.meta.title
    }
  },
  methods: {
    setActive (v) {
    }
  }
}
</script>

<style scoped>
.footer{
  background-color: #f7f7fa;
  bottom: 0;
  display: flex;
  position: fixed;
  width: 100%;
  z-index: 500;
}
.mu-bottom-item{
  min-width: 65px;
}
</style>
