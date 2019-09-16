<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  body,html {
    margin: 0;
    font-size:14px;
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }
  .fade-enter-active,
  .fade-leave-active,
  .slide-fade-enter-active,
  .slide-fade-leave-active{
    transition: none;
  }

  .slide-fade-enter,
  .slide-fade-leave-active{
    transform: translateX(20px);
    opacity: 0;
  }
  .fade-enter,
  .fade-leave-active{
    opacity: 0;
  }
  .slideUp-fade-enter-active,
  .slideUp-fade-leave-active{
    transition: none;
  }

  .slideUp-fade-enter,
  .slideUp-fade-leave-active{
    transform: translateY(5px);
    opacity: 0;
  }
  .layout {
    border: none !important;
    border-radius: 0 !important;
  }
</style>
