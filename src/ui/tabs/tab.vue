<template>
  <div class="tab-holder" @mousedown="onClicked">
    <div :class="rootClassName" :style="transformStyle">
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
import { fromEvent, Subscription } from 'rxjs'
import { concatMap, takeUntil } from 'rxjs/operators'

export default Vue.extend({
  props: {
    primary: Boolean,
    permanent: Boolean,
    active: Boolean,
    sortable: Boolean
  },
  data (): {
    subscriptions: Subscription[],
    mouseDownOffset: number,
    translationX: number
    } {
    return {
      subscriptions: [],
      mouseDownOffset: 0,
      translationX: 0
    }
  },
  computed: {
    rootClassName (): string {
      const classNames = ['tab']
      if (this.primary) classNames.push('primary')
      if (this.active) classNames.push('active')
      if (this.permanent) classNames.push('permanent')
      if (this.translationX === 0) classNames.push('transition')
      return classNames.join(' ')
    },
    transformStyle (): string {
      if (!this.sortable) return ''
      return `transform: translateX(${this.translationX}px)`
    }
  },
  watch: {
    active (newValue) {
      if (newValue) {
        this.scrollInNeed()
      }
    }
  },
  mounted () {
    if (this.active) {
      this.scrollInNeed()
    }
    this.subscriptions.push(
      fromEvent<MouseEvent>(this.$el, 'mousedown')
        .subscribe((e: MouseEvent) => {
          const el = this.$el as HTMLElement
          this.mouseDownOffset = e.clientX - el.offsetLeft
        })
    )
    this.subscriptions.push(
      fromEvent<MouseEvent>(this.$el, 'mousedown').pipe(
        concatMap(() => fromEvent<MouseEvent>(document, 'mousemove').pipe(
          takeUntil(fromEvent<MouseEvent>(document, 'mouseup'))
        ))
      ).subscribe((e: MouseEvent) => {
        const el = this.$el as HTMLElement
        this.translationX = e.clientX - el.offsetLeft - this.mouseDownOffset
        const sibling = this.translationX < 0
          ? el.previousElementSibling : el.nextElementSibling
        if (sibling && sibling.className === 'tab-holder') {
          if (Math.abs(this.translationX) > 0.55 * sibling.clientWidth) {
            this.$emit('reorder', this.translationX < 0 ? -1 : 1)
          }
        }
      })
    )
    this.subscriptions.push(
      fromEvent<MouseEvent>(document, 'mouseup')
        .subscribe(() => {
          this.translationX = 0
          this.mouseDownOffset = 0
        })
    )
  },
  beforeDestroy () {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe()
    })
  },
  methods: {
    scrollInNeed () {
      setTimeout(() => {
        const el = this.$el as HTMLElement
        let tabsWrapper: HTMLElement = el
        while (tabsWrapper.parentElement) {
          tabsWrapper = tabsWrapper.parentElement
          if (tabsWrapper.className === 'tabs-wrapper default') break
        }
        if (tabsWrapper && el
          && tabsWrapper.clientWidth < tabsWrapper.scrollWidth
        ) {
          if (tabsWrapper.scrollLeft > el.offsetLeft - tabsWrapper.offsetLeft) {
            tabsWrapper.scrollTo(el.offsetLeft - tabsWrapper.offsetLeft, 0)
            return
          }
          if (tabsWrapper.scrollLeft + tabsWrapper.clientWidth
            < el.offsetLeft - tabsWrapper.offsetLeft + el.clientWidth) {
            tabsWrapper.scrollTo(el.offsetLeft - tabsWrapper.offsetLeft + el.clientWidth - tabsWrapper.clientWidth, 0)
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

.tab.active, .tab.primary.active
  background-color #fff
  color lookup('$vue-ui-primary-500')
  z-index 2
  &:hover
    background-color #fff

.tab.primary
  background-color lookup('$vue-ui-primary-600')
  color #fff
  &:hover
    background-color lookup('$vue-ui-primary-500')

</style>
