<template>
  <div class="tabs-bar">
    <div class="tabs-wrapper pinned">
      <slot name="pinned" />
    </div>
    <div :class="`tabs-wrapper scroll-up ${scrollClass}`" ref="scrollLeft">
      <Tab permanent class="narrow">
        <VueIcon icon="keyboard_arrow_left" />
      </Tab>
    </div>
    <div class="tabs-wrapper default" ref="tabsWrapper">
      <slot />
      <resize-observer @notify="handleResize" />
    </div>
    <div :class="`tabs-wrapper scroll-down ${scrollClass}`" ref="scrollRight">
      <Tab permanent class="narrow">
        <VueIcon icon="keyboard_arrow_right" />
      </Tab>
    </div>
    <div :class="`tabs-wrapper new-tab ${newTabClass}`">
      <Tab permanent @click="newTab">
        <VueIcon icon="add" />
      </Tab>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { fromEvent, Subject, Subscription, timer } from 'rxjs'
import { concatMap, map, takeUntil } from 'rxjs/operators'

import Tab from './tab.vue'

export default Vue.extend({
  props: {
    newTabButton: Boolean
  },
  components: {
    Tab
  },
  data (): {
    overflowProbablyChange: Subject<null>,
    mutationObserver: MutationObserver | null
    subscriptions: Subscription[],
    scrollable: boolean
    } {
    return {
      overflowProbablyChange: new Subject<null>(),
      mutationObserver: null,
      subscriptions: [],
      scrollable: false
    }
  },
  computed: {
    scrollClass (): string {
      return this.scrollable ? 'scrollable' : ''
    },
    newTabClass (): string {
      return this.newTabButton ? 'new-tab-able' : ''
    }
  },
  mounted () {
    this.updateScrollable()
    this.subscriptions.push(this.overflowProbablyChange.asObservable().subscribe(this.updateScrollable))
    this.mutationObserver = new MutationObserver(() => {
      this.overflowProbablyChange.next(null)
    })
    this.mutationObserver.observe(this.$refs.tabsWrapper as HTMLElement, { childList: true })
    const clickToScroll = (element: HTMLElement, opposite: boolean) => {
      this.subscriptions.push(
        fromEvent(element, 'mousedown').pipe(
          concatMap(() => timer(0, 200).pipe(
            takeUntil(fromEvent(element, 'mouseup')),
            map((cnt) => 20 + Math.pow(2, cnt))
          ))
        ).subscribe(offset => {
          if (opposite) offset = -offset
          ;(this.$refs.tabsWrapper as HTMLElement).scrollBy(offset, 0)
        })
      )
    }
    clickToScroll(this.$refs.scrollLeft as HTMLElement, true)
    clickToScroll(this.$refs.scrollRight as HTMLElement, false)
    this.subscriptions.push(
      fromEvent<WheelEvent>(this.$refs.tabsWrapper as HTMLElement, 'wheel').pipe(
        map((e: WheelEvent) => {
          return 10 * e.deltaY
        })
      ).subscribe(offset => {
        (this.$refs.tabsWrapper as HTMLElement).scrollBy(offset, 0)
      })
    )
  },
  beforeDestroy () {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe()
    })
    this.mutationObserver?.disconnect()
  },
  methods: {
    handleResize () {
      this.overflowProbablyChange.next(null)
    },
    updateScrollable () {
      const tabsWrapper = this.$refs.tabsWrapper as HTMLElement
      this.scrollable = tabsWrapper.clientWidth < tabsWrapper.scrollWidth
    },
    newTab () {
      this.$emit('new-tab')
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
  .tab-holder:first-child
    margin-left 0
  .tab-holder:nth-last-child(2)
    margin-right 0

.tabs-wrapper
  display flex
  justify-content flex-start
  align-items flex-end
  overflow-x auto
  overflow-x -moz-scrollbars-none
  -ms-overflow-style none
  scrollbar-width none

  &::-webkit-scrollbar
    height 0 !important

.tabs-wrapper
  &.pinned, &.scroll-up, &.scroll-down, &.new-tab
    flex none

.tabs-wrapper
  &.scroll-up, &.scroll-down, &.new-tab
    display none

.tabs-wrapper.scrollable
  &.scroll-up, &.scroll-down
    display flex

.tabs-wrapper.new-tab-able
  &.new-tab
    display flex
</style>
