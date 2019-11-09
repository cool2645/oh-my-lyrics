<template>
  <Tabs>
    <template v-slot:pinned>
      <Tab primary permanent>LyricsXML</Tab>
    </template>
    <Tab>Document 1</Tab>
    <Tab>Document 2</Tab>
    <Tab>Document 3</Tab>
    <Tab @click="() => alert('activate 4')" @close="() => alert('close 4')">Document 4</Tab>
    <Tab>Document 5</Tab>
    <Tab active>Document 6</Tab>
    <Tab>Document 7</Tab>
  </Tabs>
</template>

<script lang="ts">
import Vue from 'vue'

import Tabs from '@/ui/tabs/tabs.vue'
import Tab from '@/ui/tabs/tab.vue'

export default Vue.extend({
  components: {
    Tabs,
    Tab
  },
  methods: {
    alert (e: string) {
      alert(e)
    }
  }
})
</script>

<style scoped>

</style>
