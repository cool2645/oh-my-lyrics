<template>
  <div class="tabs-bar">
    <div class="tabs-wrapper pinned">
      <slot name="pinned" />
    </div>
    <div class="tabs-wrapper scroll-up">
      <Tab permanent class="narrow">
        <VueIcon icon="keyboard_arrow_left"/>
      </Tab>
    </div>
    <div class="tabs-wrapper default">
      <slot />
    </div>
    <div class="tabs-wrapper scroll-down">
      <Tab permanent class="narrow">
        <VueIcon icon="keyboard_arrow_right"/>
      </Tab>
    </div>
  </div>
</template>

<script>
import Tab from './tab.vue'
export default {
  components: {
    Tab
  }
}
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

</style>
