<template>
  <Menu>
    <template v-for="(item, i) in menu">
      <MenuItem v-if="!item.hasSubmenu" :key="item.name"
                :selected="item.name === selectedMenu"
                @click="item.open(item.name, i)"
      >
        <VueIcon v-if="item.icon" :icon="item.icon" />
        {{ item.title }}
      </MenuItem>
      <Submenu v-else :key="item.name">
        <template v-slot:title>
          <VueIcon v-if="item.icon" :icon="item.icon" />
          {{ item.title }}
        </template>
        <MenuItem v-for="(subItem, i) in item.submenu" :key="subItem"
                  :selected="item.name === selectedMenu && i === selectedId"
                  @click="item.open(item.name, i)"
        >
          {{ subItem }}
        </MenuItem>
        <MenuItem>
          <VueIcon icon="add" />
          添加新{{ item.title }}
        </MenuItem>
      </Submenu>
    </template>
  </Menu>
</template>

<script lang="ts">
import Vue from 'vue'

import Menu from '@/ui/menu/menu.vue'
import Submenu from '@/ui/menu/submenu.vue'
import MenuItem from '@/ui/menu/menu-item.vue'
import { EditorMode, START_MENU, StartMenu } from '@/store'

interface IMenu {
  name: StartMenu | EditorMode,
  icon?: string,
  title: string,
  hasSubmenu: boolean,
  submenu?: string[]
  open:
    | ((name: StartMenu) => void)
    | ((name: EditorMode, submenuId?: number) => void)
}

export default Vue.extend({
  components: {
    MenuItem,
    Menu,
    Submenu
  },
  computed: {
    isStartMenu (): boolean {
      return this.$store.state.currentTabId === START_MENU
    },
    selectedMenu (): StartMenu | EditorMode {
      return this.isStartMenu ? this.$store.state.startMenu
        : this.$store.state.tabs[this.$store.state.currentTabId].editorMode
    },
    selectedId (): number {
      if (this.selectedMenu === 'RUBY') {
        return this.$store.state.tabs[this.$store.state.currentTabId].rubyId
      }
      if (this.selectedMenu === 'TRANSLATE') {
        return this.$store.state.tabs[this.$store.state.currentTabId]?.translationId
      }
      return -1
    },
    menu (): IMenu[] {
      if (this.isStartMenu) {
        return [{
          name: 'WELCOME',
          icon: 'toys',
          title: '欢迎',
          hasSubmenu: false,
          open: this.setStartMenu
        }, {
          name: 'NEW',
          icon: 'insert_drive_file',
          title: '新建',
          hasSubmenu: false,
          open: this.setStartMenu
        }, {
          name: 'IMPORT',
          icon: 'create_new_folder',
          title: '导入',
          hasSubmenu: false,
          open: this.setStartMenu
        }, {
          name: 'EXPORT',
          icon: 'save',
          title: '导出',
          hasSubmenu: false,
          open: this.setStartMenu
        }, {
          name: 'PREFERENCES',
          icon: 'settings',
          title: '偏好',
          hasSubmenu: false,
          open: this.setStartMenu
        }, {
          name: 'ABOUT',
          icon: 'help',
          title: '关于',
          hasSubmenu: false,
          open: this.setStartMenu
        }]
      }
      return [{
        name: 'HEAD',
        icon: 'fingerprint',
        title: '基本信息',
        hasSubmenu: false,
        open: this.setEditorMode
      }, {
        name: 'LYRICS',
        icon: 'subject',
        title: '歌词',
        hasSubmenu: false,
        open: this.setEditorMode
      }, {
        name: 'SPLIT_WORDS',
        icon: 'translate',
        title: '分词',
        hasSubmenu: false,
        open: this.setEditorMode
      }, {
        name: 'SPLIT_PHONEMES',
        icon: 'music_note',
        title: '分字',
        hasSubmenu: false,
        open: this.setEditorMode
      }, {
        name: 'TIMELINE',
        icon: 'play_circle_filled',
        title: '时轴',
        hasSubmenu: false,
        open: this.setEditorMode
      }, {
        name: 'RUBY',
        icon: 'sort_by_alpha',
        title: '注音',
        hasSubmenu: true,
        submenu: this.$store.state.tabs[this.$store.state.currentTabId].rubies,
        open: this.setEditorMode
      }, {
        name: 'TRANSLATE',
        icon: 'language',
        title: '翻译',
        hasSubmenu: true,
        submenu: this.$store.state.tabs[this.$store.state.currentTabId].translations,
        open: this.setEditorMode
      }]
    }
  },
  methods: {
    setStartMenu (startMenu: StartMenu) {
      this.$store.commit('UPDATE_START_MENU', startMenu)
    },
    setEditorMode (editorMode: EditorMode, id?: number) {
      this.$store.commit('UPDATE_EDITOR_MODE', { editorMode, id })
    }
  }
})
</script>

<style scoped>

</style>
