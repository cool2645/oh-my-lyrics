<template>
  <div>
    <Tabs new-tab-button @new-tab="newLyrics">
      <template v-slot:pinned>
        <Tab primary permanent :active="showStartMenu"
              @click="switchToTab(startMenuId)"
        >LyricsXML</Tab>
      </template>
      <transition-group name="document-tabs" tag="div" class="transition-group">
        <Tab v-for="(tab, i) in tabs" :key="tab._id" :active="i === currentTabId" :sortable="true"
             @click="switchToTab(i)" @close="confirmCloseTab(i)"
        >
          {{ tab.document.title }}
        </Tab>
      </transition-group>
    </Tabs>
    <VueModal
      v-if="confirmClosing"
      title="确认"
      :locked="false"
      class="small"
      @close="confirmClosing = false"
    >
      <div class="default-body">
        文档关闭后未导出的内容将无法恢复，确定关闭吗？
      </div>
      <div slot="footer" class="actions">
        <VueButton class="default" @click="confirmClosing = false">取消</VueButton>
        <VueButton class="primary" @click="closeTabAndConfirm()">关闭</VueButton>
      </div>
    </VueModal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapMutations } from 'vuex'

import Tabs from '@/ui/tabs/tabs.vue'
import Tab from '@/ui/tabs/tab.vue'
import { START_MENU, Tab as ITab } from '@/store'

export default Vue.extend({
  components: {
    Tabs,
    Tab
  },
  data () {
    return {
      confirmClosing: false,
      closingTabId: 0
    }
  },
  computed: {
    startMenuId (): number {
      return START_MENU
    },
    showStartMenu (): boolean {
      return this.$store.state.currentTabId === this.startMenuId
    },
    currentTabId (): number {
      return this.$store.state.currentTabId
    },
    tabs (): ITab[] {
      return this.$store.state.tabs
    }
  },
  methods: {
    ...mapMutations({
      switchToTab: 'ACTIVATE_TAB',
      closeTab: 'CLOSE_TAB'
    }),
    ...mapActions([
      'newLyrics',
      'closeLyrics'
    ]),
    confirmCloseTab (id: number) {
      this.closingTabId = id
      this.confirmClosing = true
    },
    closeTabAndConfirm () {
      (this as any).closeTab(this.closingTabId)
      this.confirmClosing = false
    }
  }
})
</script>

<style lang="stylus" scoped>
.transition-group
  display flex
  justify-content flex-start
  align-items flex-end
  overflow visible

.document-tabs-move
  transition transform .2s

.document-tabs-enter-active, .document-tabs-leave-active
  transition transform .2s
  transform-origin left

.document-tabs-enter, .document-tabs-leave-to
  transform scaleX(0)
</style>
