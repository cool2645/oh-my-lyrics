<template>
  <div :class="rootClassName">
    <span>
      <slot />
    </span>
    <div v-if="!permanent" class="close-button" @click="close">
      <VueIcon icon="clear"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    rootClassName () {
      const classNames = ['tab']
      if (this.primary) classNames.push('primary')
      if (this.active) classNames.push('active')
      if (this.permanent) classNames.push('permanent')
      return classNames.join(' ')
    }
  },
  props: {
    primary: Boolean,
    permanent: Boolean,
    active: Boolean
  },
  watch: {
    active (newValue) {
      if (newValue) {
        const tabsWrapper = this.$el?.parentElement
        if (tabsWrapper && tabsWrapper.clientWidth < tabsWrapper.scrollWidth) {
          this.scrollToShow()
        }
      }
    }
  },
  mounted () {
    if (this.active) {
      const tabsWrapper = this.$el?.parentElement
      if (tabsWrapper && tabsWrapper.clientWidth < tabsWrapper.scrollWidth) {
        this.scrollToShow()
      }
    }
  },
  methods: {
    scrollToShow () {
      const tabsWrapper = this.$el?.parentElement
      console.log('need scroll')
    },
    close () {
      this.$emit('close')
    }
  }
})
</script>

<style lang="stylus" scoped>
@import "~@vue/ui/src/style/imports"

.tab
  position relative
  margin 0 1px
  padding 20px 50px 20px 20px
  cursor default
  background-color lookup('$vue-ui-gray-300')
  color #000
  white-space nowrap
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
      background-color lookup('$vue-ui-gray-300')
    svg
      width 20px
      height 20px

.tab.active, .tab.primary.active
  background-color #fff
  color lookup('$vue-ui-primary-500')

.tab.primary
  background-color lookup('$vue-ui-primary-600')
  color #fff
  &:hover
    background-color lookup('$vue-ui-primary-500')

</style>
