<template>
  <div>
    <Tabs new-tab-button @new-tab="newLyrics">
      <template v-slot:pinned>
        <Tab primary permanent :active="showStartMenu"
              @click="switchToTab(startMenuId)"
        >LyricsXML</Tab>
      </template>
      <Tab v-for="(tab, i) in tabs" :key="i" :active="tab.isActive" :sortable="true"
            @click="switchToTab(i)" @close="confirmCloseTab(i, tab.isDocument)"
      >
        {{ tab.title }}
      </Tab>
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

interface INavTab {
  title: string,
  isActive: boolean,
  isDocument: boolean
}

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
    tabs (): INavTab[] {
      return this.$store.state.tabs.map(
        (tab: ITab, i: number) => ({
          title: tab.document.title,
          isActive: i === this.$store.state.currentTabId,
          isDocument: true
        })
      )
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
    confirmCloseTab (id: number, isDocument: boolean) {
      if (isDocument) {
        this.closingTabId = id
        this.confirmClosing = true
      } else (this as any).closeTab(id)
    },
    closeTabAndConfirm () {
      (this as any).closeTab(this.closingTabId)
      this.confirmClosing = false
    }
  }
})
</script>

<style scoped>

</style>
