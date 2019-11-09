<template>
  <Menu>
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
</template>

<script lang="ts">
import Vue from 'vue'

import Menu from '@/ui/menu/menu.vue'
import Submenu from '@/ui/menu/submenu.vue'
import MenuItem from '@/ui/menu/menu-item.vue'

export default Vue.extend({
  components: {
    MenuItem,
    Menu,
    Submenu
  }
})
</script>

<style scoped>

</style>
