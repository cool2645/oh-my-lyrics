<template>
  <div :class="tabHolderClassName" tab-holder @mousedown="onClicked">
    <div :class="tabClassName" :style="transformStyle">
        <span>
          <slot />
        </span>
      <div v-if="!permanent" class="close-button">
        <VueIcon icon="clear" @mousedown="closeBtnClicked" @click="close"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { fromEvent, of, Subscription, timer } from 'rxjs'
import { concatMap, filter, mapTo, switchMap, takeUntil } from 'rxjs/operators'

export default Vue.extend({
  props: {
    primary: Boolean,
    permanent: Boolean,
    active: Boolean,
    sortable: Boolean
  },
  data (): {
    subscriptions: Subscription[],
    mouseDown: boolean,
    mouseDownOffset: number,
    mouseDownScrollOffset: number,
    translationX: number
    } {
    return {
      subscriptions: [],
      mouseDown: false,
      mouseDownOffset: 0,
      mouseDownScrollOffset: 0,
      translationX: 0
    }
  },
  computed: {
    tabHolderClassName (): string {
      const classNames = ['tab-holder']
      if (this.active) classNames.push('active')
      if (this.translationX !== 0) classNames.push('no-transit')
      return classNames.join(' ')
    },
    tabClassName (): string {
      const classNames = ['tab']
      if (this.primary) classNames.push('primary')
      if (this.permanent) classNames.push('permanent')
      if (this.translationX === 0) classNames.push('transition')
      return classNames.join(' ')
    },
    transformStyle (): string {
      if (!this.sortable || this.translationX === 0) return ''
      return `transform: translateX(${this.translationX}px)`
    },
    tabsWrapper (): HTMLElement {
      let tabsWrapper: HTMLElement = this.$el as HTMLElement
      while (tabsWrapper.parentElement) {
        tabsWrapper = tabsWrapper.parentElement
        if (tabsWrapper.hasAttribute('document-tabs-wrapper')) break
      }
      return tabsWrapper
    }
  },
  watch: {
    active (newValue) {
      if (newValue) this.scrollInNeed()
    }
  },
  mounted () {
    if (this.active) this.scrollInNeed()
    const mouseDown$ = fromEvent<MouseEvent>(this.$el, 'mousedown').pipe(
      filter(() => this.sortable)
    )
    this.subscriptions.push(
      mouseDown$.subscribe((e: MouseEvent) => {
        const el = this.$el as HTMLElement
        this.mouseDownOffset = e.clientX - el.offsetLeft
        if (this.tabsWrapper) {
          this.mouseDownScrollOffset = this.tabsWrapper.scrollLeft
        }
        this.mouseDown = true
      })
    )
    this.subscriptions.push(
      mouseDown$.pipe(
        concatMap(() => fromEvent<MouseEvent>(document, 'mousemove').pipe(
          takeUntil(fromEvent<MouseEvent>(document, 'mouseup'))
        )),
        switchMap((e) => {
          if (this.tabsWrapper) {
            const left = this.tabsWrapper.getBoundingClientRect().left
            const right = this.tabsWrapper.getBoundingClientRect().right
            if (e.clientX < left) {
              return timer(0, 12).pipe(
                takeUntil(fromEvent<MouseEvent>(document, 'mouseup')),
                mapTo({ e, offset: -1 })
              )
            }
            if (e.clientX > right) {
              return timer(0, 12).pipe(
                takeUntil(fromEvent<MouseEvent>(document, 'mouseup')),
                mapTo({ e, offset: 1 })
              )
            }
          }
          return of({ e, offset: 0 })
        })
      ).subscribe(({ e, offset }) => {
        const el = this.$el as HTMLElement
        let translationX = e.clientX - el.offsetLeft - this.mouseDownOffset
        if (this.tabsWrapper) {
          if (offset) this.tabsWrapper.scrollLeft += offset
          translationX += this.tabsWrapper.scrollLeft - this.mouseDownScrollOffset
        }
        this.translationX = translationX
        const sibling = this.translationX < 0
          ? el.previousElementSibling : el.nextElementSibling
        if (sibling && sibling.hasAttribute('tab-holder')) {
          if (Math.abs(this.translationX) > 0.55 * sibling.clientWidth) {
            this.$emit('reorder', this.translationX < 0 ? -1 : 1)
            if (this.translationX < 0) this.translationX += sibling.clientWidth
            else this.translationX -= sibling.clientWidth
          }
        }
      })
    )
    this.subscriptions.push(
      fromEvent<MouseEvent>(document, 'mouseup')
        .subscribe(() => {
          if (this.mouseDown) this.scrollInNeed()
          this.mouseDown = false
          this.translationX = 0
          this.mouseDownOffset = 0
        })
    )
  },
  beforeDestroy () {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  },
  methods: {
    scrollInNeed () {
      setTimeout(() => {
        const el = this.$el as HTMLElement
        const tabsWrapper = this.tabsWrapper
        if (tabsWrapper && el
          && tabsWrapper.clientWidth < tabsWrapper.scrollWidth
        ) {
          if (tabsWrapper.scrollLeft > el.offsetLeft - tabsWrapper.offsetLeft) {
            tabsWrapper.scrollLeft = el.offsetLeft - tabsWrapper.offsetLeft
            return
          }
          if (tabsWrapper.scrollLeft + tabsWrapper.clientWidth
            < el.offsetLeft - tabsWrapper.offsetLeft + el.clientWidth) {
            tabsWrapper.scrollLeft = el.offsetLeft - tabsWrapper.offsetLeft + el.clientWidth - tabsWrapper.clientWidth
          }
        }
      }, 0)
    },
    closeBtnClicked (e: MouseEvent) {
      e.stopPropagation()
    },
    close (e: MouseEvent) {
      this.$emit('close', e)
    },
    onClicked (e: MouseEvent) {
      this.$emit('click', e)
    }
  }
})
</script>

<style lang="stylus" scoped>
@import "~@vue/ui/src/style/imports"

.narrow .tab, .narrow .tab.permanent
  padding 20px 10px

.tab-holder:first-child .tab
  margin-left 0
.tab-holder:last-child .tab
  margin-right 0

.tab
  position relative
  margin 0 1px
  padding 20px 50px 20px 20px
  cursor default
  background-color lookup('$vue-ui-gray-300')
  color #000
  white-space nowrap
  user-select none
  &.transition
    transition transform .2s ease-out
  &:hover
    background-color lookup('$vue-ui-gray-100')
  span
    display inline-block
    vertical-align middle
    max-width 300px
    overflow hidden
    text-overflow ellipsis
    height 1em
    .vue-ui-icon
      height 1em
      width 1em
      vertical-align middle
      svg
        width 100%
        height 100%

.tab.permanent
  padding 20px

.close-button
  position absolute
  top 0
  right 15px
  width 25px
  display flex
  flex-direction column
  justify-content center
  align-items center
  height 100%
  .vue-ui-icon
    width 20px
    height 20px
    border-radius 50%
    padding 5px
    &:hover
      background-color lookup('$vue-ui-gray-200')
    &:hover:active
      background-color lookup('$vue-ui-gray-300')
    svg
      width 20px
      height 20px

.no-transit
  transition none!important

.active
  z-index 2

.active .tab, .active .tab.primary
  background-color #fff
  color lookup('$vue-ui-primary-500')
  &:hover
    background-color #fff

.tab.primary
  background-color lookup('$vue-ui-primary-600')
  color #fff
  &:hover
    background-color lookup('$vue-ui-primary-500')

</style>
