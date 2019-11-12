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
      <div class="observable" ref="resizeObservable">
        <slot />
      </div>
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
import { fromEvent, Subject, timer } from 'rxjs'
import { concatMap, map, scan, switchMapTo, takeUntil } from 'rxjs/operators'
import ResizeObserver from 'resize-observer-polyfill'

import Tab from './tab.vue'

export default Vue.extend({
  props: {
    newTabButton: Boolean
  },
  components: {
    Tab
  },
  data (): {
    resizeObserver: ResizeObserver | null,
    scrollableMayChange$: Subject<void>,
    scrollable: boolean
    } {
    return {
      resizeObserver: null,
      scrollableMayChange$: new Subject<void>(),
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
    this.scrollableMayChange$.next()
    this.resizeObserver = new ResizeObserver(() => this.scrollableMayChange$.next())
    this.resizeObserver.observe(this.$refs.resizeObservable as HTMLElement)
    const clickToScroll = (element: HTMLElement, opposite: boolean) => {
      this.$subscribeTo(
        fromEvent(element, 'mousedown').pipe(
          concatMap(() => timer(0, 200).pipe(
            takeUntil(fromEvent(document, 'mouseup')),
            map((cnt) => 20 + Math.pow(2, cnt)),
            map((offset) => opposite ? -offset : offset)
          ))
        ), (offset) => {
          (this.$refs.tabsWrapper as HTMLElement).scrollLeft += offset
        }
      )
    }
    clickToScroll(this.$refs.scrollLeft as HTMLElement, true)
    clickToScroll(this.$refs.scrollRight as HTMLElement, false)
    this.$subscribeTo(
      fromEvent<WheelEvent>(this.$refs.tabsWrapper as HTMLElement, 'wheel').pipe(
        map((e: WheelEvent) => {
          return 30 * (e.deltaY > 0 ? 1 : -1)
        })
      ), (offset) => {
        (this.$refs.tabsWrapper as HTMLElement).scrollLeft += offset
      }
    )
    this.$subscribeTo(
      this.scrollableMayChange$.asObservable().pipe(
        switchMapTo(timer(300)),
        scan((scrollable) => {
          const tabsWrapper = this.$refs.tabsWrapper as HTMLElement
          return scrollable
            ? tabsWrapper.clientWidth < tabsWrapper.scrollWidth - 76
            : tabsWrapper.clientWidth < tabsWrapper.scrollWidth
        }, this.scrollable)
      ), (scrollable) => {
        this.scrollable = scrollable
      }
    )
  },
  beforeDestroy () {
    this.resizeObserver?.disconnect()
  },
  methods: {
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

.observable
  position relative

.narrow
  >>> .tab, .tab.permanent
    padding 20px 10px
</style>
