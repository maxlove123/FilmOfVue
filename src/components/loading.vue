<template>
  <div class="loading">
    <wv-loadmore v-if="show"></wv-loadmore>
  </div>
</template>

<script>
export default {
  name: 'loading',
  props: {
    show: false
  },
  data () {
    return {}
  }
}
</script>

<style scoped>
</style>
