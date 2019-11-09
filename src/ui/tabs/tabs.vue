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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { fromEvent, Subject, Subscription, timer } from 'rxjs'
import { map, switchMap, takeUntil } from 'rxjs/operators'

import Tab from './tab.vue'

export default Vue.extend({
  components: {
    Tab
  },
  data (): {
    overflowProbablyChange: Subject<null>,
    subscriptions: Subscription[],
    scrollable: boolean
    } {
    return {
      overflowProbablyChange: new Subject<null>(),
      subscriptions: [],
      scrollable: false
    }
  },
  computed: {
    scrollClass (): string {
      return this.scrollable ? 'scrollable' : ''
    }
  },
  mounted () {
    this.updateScrollable()
    this.subscriptions.push(this.overflowProbablyChange.asObservable().subscribe(this.updateScrollable))
    const clickToScroll = (element: HTMLElement, opposite: boolean) => {
      this.subscriptions.push(
        fromEvent(element, 'mousedown')
          .pipe(
            switchMap(
              () => timer(0, 200)
                .pipe(
                  map((cnt) => 20 + Math.pow(2, cnt)),
                  takeUntil(fromEvent(element, 'mouseup'))
                )
            )
          )
          .subscribe(offset => {
            if (opposite) offset = -offset
            ;(this.$refs.tabsWrapper as HTMLElement).scrollBy(offset, 0)
          })
      )
    }
    clickToScroll(this.$refs.scrollLeft as HTMLElement, true)
    clickToScroll(this.$refs.scrollRight as HTMLElement, false)
  },
  beforeDestroy () {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe()
    })
  },
  methods: {
    handleResize () {
      this.overflowProbablyChange.next(null)
    },
    updateScrollable () {
      const tabsWrapper = this.$refs.tabsWrapper as HTMLElement
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
