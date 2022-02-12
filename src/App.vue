<template>
  <div id="app">
    <!-- keep-alive 是 Vue 内置的一个组件，可以使被包含的组件保留状态，或避免重新渲染。 -->
    <!-- exclude 把 Detail组件 排除到保留状态之外-->
    <!-- v-if="$route.meta.footShow" 在Detail组件里让底部导航不渲染 -->
    <keep-alive exclude="Detail">
      <router-view></router-view>
    </keep-alive>
    <main-tab-bar v-if="$route.meta.footShow"></main-tab-bar>
  </div>
</template>

<script>
  import MainTabBar from "components/content/mainTabbar/MainTabBar.vue"

  export default {
    name: 'App',
    components: {
      MainTabBar
    }
  }
</script>

<style>
  @import "assets/css/base.css"
</style>
