<template>
  <div id="app">
    <NavBar class="nav" />
    <div class="tabs-view">
      <SideBar class="side-menu" />
      <main class="main">
        <div class="content-page">
          <HeadPage v-if="selectedMenu === 'HEAD'" />
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import NavBar from '@/components/NavBar.vue'
import SideBar from '@/components/SideBar.vue'
import HeadPage from '@/components/HeadPage.vue'
import { EditorMode, START_MENU, StartMenu } from '@/store'

export default Vue.extend({
  name: 'app',
  components: {
    NavBar,
    SideBar,
    HeadPage
  },
  computed: {
    selectedMenu (): StartMenu | EditorMode {
      return this.$store.state.currentTabId === START_MENU ? this.$store.state.startMenu
        : this.$store.state.tabs[this.$store.state.currentTabId].editorMode
    }
  }
})
</script>

<style lang="stylus">
body
  margin 0
  min-width 1000px
  overflow-y hidden
.nav
  position fixed
  top 0
  left 0
  width 100%
  height 60px
  z-index 2
.tabs-view
  margin-top 60px
  height calc(100% - 60px)
  overflow auto
.side-menu
  position absolute
  top 60px
  left 0
  height 100%
  width 300px
.main
  margin-left 300px
  width calc(100% - 300px)
  height calc(100vh - 60px)
.content-page
  width 600px
  margin 0 auto
  padding 50px 0
</style>
