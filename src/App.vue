<template>
  <div id="app">
    <Tabs>
      <template v-slot:pinned>
        <Tab primary permanent>LyricsXML</Tab>
      </template>
      <Tab active>Document 1</Tab>
      <Tab>Document 2</Tab>
      <Tab>Document 3</Tab>
      <Tab>Document 4</Tab>
      <Tab>Document 5</Tab>
      <Tab>Document 6</Tab>
      <Tab>Document 7</Tab>
    </Tabs>
    <div class="tabs-view">
      <Menu class="side-menu">
        <MenuItem><VueIcon icon="fingerprint" />基本信息</MenuItem>
        <MenuItem><VueIcon icon="subject" />歌词</MenuItem>
        <MenuItem selected><VueIcon icon="translate" />分词</MenuItem>
        <MenuItem><VueIcon icon="music_note" />分字</MenuItem>
        <MenuItem><VueIcon icon="play_circle_filled" />时轴</MenuItem>
        <Submenu>
          <template v-slot:title>
            <VueIcon icon="sort_by_alpha" />注音
          </template>
          <MenuItem>Hanyu Pinyin</MenuItem>
          <MenuItem>ㄓㄨㄧㄣㄈㄨㄏㄠ</MenuItem>
        </Submenu>
        <Submenu>
          <template v-slot:title>
            <VueIcon icon="language" />翻译
          </template>
          <MenuItem>简体中文</MenuItem>
          <MenuItem>English</MenuItem>
        </Submenu>
      </Menu>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Tabs from '@/ui/tabs/tabs.vue'
import Tab from '@/ui/tabs/tab.vue'
import Menu from '@/ui/menu/menu.vue'
import Submenu from '@/ui/menu/submenu.vue'
import MenuItem from '@/ui/menu/menu-item.vue'

export default Vue.extend({
  name: 'app',
  components: {
    MenuItem,
    Menu,
    Submenu,
    Tabs,
    Tab
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
