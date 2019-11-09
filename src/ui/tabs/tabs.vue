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
    <div class="tabs-wrapper default" ref="tabsWrapper" document-tabs-wrapper>
      <div>
        <slot />
      </div>
      <resize-observer key="resize-observer" @notify="handleResize" />
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
import { fromEvent, NEVER, Subject, Subscription, timer } from 'rxjs'
import { concatMap, distinctUntilChanged, map, mapTo, switchMap, takeUntil } from 'rxjs/operators'

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
    scrollable: boolean,
    mouseDown: boolean,
    overflowDirtyDuringMouseDown: boolean
    } {
    return {
      overflowProbablyChange: new Subject<null>(),
      mutationObserver: null,
      subscriptions: [],
      scrollable: false,
      mouseDown: false,
      overflowDirtyDuringMouseDown: false
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
    this.mutationObserver.observe(this.$refs.tabsWrapper as HTMLElement, { childList: true, subtree: true })
    const clickToScroll = (element: HTMLElement, opposite: boolean) => {
      this.subscriptions.push(
        fromEvent(element, 'mousedown').pipe(
          concatMap(() => timer(0, 200).pipe(
            takeUntil(fromEvent(element, 'mouseup')),
            map((cnt) => 20 + Math.pow(2, cnt)),
            map((offset) => opposite ? -offset : offset)
          ))
        ).subscribe(offset => {
          (this.$refs.tabsWrapper as HTMLElement).scrollBy(offset, 0)
        })
      )
    }
    clickToScroll(this.$refs.scrollLeft as HTMLElement, true)
    clickToScroll(this.$refs.scrollRight as HTMLElement, false)
    this.subscriptions.push(
      fromEvent(this.$refs.tabsWrapper as HTMLElement, 'mousedown')
        .subscribe(() => {
          this.mouseDown = true
          this.overflowDirtyDuringMouseDown = false
        })
    )
    this.subscriptions.push(
      fromEvent<MouseEvent>(this.$refs.tabsWrapper as HTMLElement, 'mousedown').pipe(
        concatMap(() => fromEvent<MouseEvent>(document, 'mousemove').pipe(
          takeUntil(fromEvent<MouseEvent>(document, 'mouseup'))
        )),
        map((e) => {
          if (this.scrollable) {
            const left = (this.$refs.scrollLeft as HTMLElement).getBoundingClientRect().right
            const right = (this.$refs.scrollRight as HTMLElement).getBoundingClientRect().left
            if (e.clientX < left) return -1
            if (e.clientX > right) return 1
          }
          return 0
        }),
        distinctUntilChanged(),
        switchMap((e) => {
          if (e !== 0) {
            return timer(0, 12).pipe(
              takeUntil(fromEvent<MouseEvent>(document, 'mouseup')),
              mapTo(e)
            )
          }
          return NEVER
        })
      ).subscribe((offset) => {
        (this.$refs.tabsWrapper as HTMLElement).scrollBy(offset, 0)
      })
    )
    this.subscriptions.push(
      fromEvent(document, 'mouseup')
        .subscribe(() => {
          this.mouseDown = false
          if (this.overflowDirtyDuringMouseDown) {
            setTimeout(() => this.overflowProbablyChange.next(null), 300) // after transition
          }
        })
    )
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
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
    this.mutationObserver?.disconnect()
  },
  methods: {
    handleResize () {
      this.overflowProbablyChange.next(null)
    },
    updateScrollable () {
      const tabsWrapper = this.$refs.tabsWrapper as HTMLElement
      if (!this.mouseDown) this.scrollable = tabsWrapper.clientWidth < tabsWrapper.scrollWidth
      else this.overflowDirtyDuringMouseDown = true
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

.tabs-wrapper
  margin 0 1px
  display flex
  justify-content flex-start
  align-items flex-end
  overflow-x auto
  overflow-x -moz-scrollbars-none
  -ms-overflow-style none
  scrollbar-width none

  &::-webkit-scrollbar
    height 0 !important

.tabs-wrapper > div
  display flex
  justify-content flex-start
  align-items flex-end
  overflow visible

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
