<template>
  <div id="app">
    <NavBar />
    <div class="tabs-view">
      <SideBar class="side-menu" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import NavBar from '@/components/NavBar.vue'
import SideBar from '@/components/SideBar.vue'

export default Vue.extend({
  name: 'app',
  components: {
    NavBar,
    SideBar
  }
})
</script>

<style lang="stylus">
body
  margin 0
.side-menu
  width 300px
  height 100%
</style>
