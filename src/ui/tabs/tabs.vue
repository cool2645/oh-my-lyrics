<template>
  <div class="tabs-bar">
    <div class="tabs-wrapper pinned">
      <slot name="pinned" />
    </div>
    <div :class="`tabs-wrapper scroll-up ${scrollClass}`">
      <Tab permanent class="narrow">
        <VueIcon icon="keyboard_arrow_left"/>
      </Tab>
    </div>
    <div class="tabs-wrapper default" ref="tabsWrapper">
      <slot />
    </div>
    <div :class="`tabs-wrapper scroll-down ${scrollClass}`">
      <Tab permanent class="narrow">
        <VueIcon icon="keyboard_arrow_right"/>
      </Tab>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ResizeObserver from 'resize-observer-polyfill'
import { Subject, Subscription } from 'rxjs'

import Tab from './tab.vue'

export default Vue.extend({
  components: {
    Tab
  },
  data (): {
    overflowProbablyChange: Subject<null>,
    resizeObserver: ResizeObserver | null,
    subscriptions: Subscription[],
    scrollable: boolean
    } {
    return {
      overflowProbablyChange: new Subject<null>(),
      resizeObserver: null,
      subscriptions: [],
      scrollable: false
    }
  },
  computed: {
    scrollClass (): string {
      return this.scrollable ? 'scrollable' : ''
    }
  },
  created () {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        this.overflowProbablyChange.next(null)
      }
    })
  },
  mounted () {
    this.updateScrollable()
    this.resizeObserver?.observe(this.$refs.tabsWrapper as Element)
    this.subscriptions.push(this.overflowProbablyChange.asObservable().subscribe(this.updateScrollable))
  },
  beforeDestroy () {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe()
    })
    this.resizeObserver?.disconnect()
  },
  methods: {
    updateScrollable () {
      const tabsWrapper = this.$refs.tabsWrapper as Element
      this.scrollable = tabsWrapper.clientWidth < tabsWrapper.scrollWidth
    }
  }
})
</script>

<style lang="stylus" scoped>
@import "~@vue/ui/src/style/imports"

.tabs-bar
  display flex
  justify-content flex-start
  align-items flex-end
  width 100%
  background-color lookup('$vue-ui-gray-900')

.tabs-wrapper.default
  margin 0 1px
  .tab:first-child
    margin-left 0
  .tab:last-child
    margin-right 0
.tabs-wrapper
  display flex
  justify-content flex-start
  align-items flex-end
  overflow-y auto
  overflow-y -moz-scrollbars-none
  -ms-overflow-style none
  scrollbar-width none
  &::-webkit-scrollbar
    height 0!important
.tabs-wrapper .narrow
  padding 20px 10px
.tabs-wrapper
  &.pinned, &.scroll-up, &.scroll-down
    flex none
.tabs-wrapper
  &.scroll-up, &.scroll-down
    display none
.tabs-wrapper.scrollable
  &.scroll-up, &.scroll-down
    display flex
</style>
