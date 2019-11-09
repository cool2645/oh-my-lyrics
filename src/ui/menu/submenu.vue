<template>
  <li>
    <div class="title">
      <slot name="title" />
      <div class="expand-icon">
        <VueIcon icon="keyboard_arrow_up"/>
      </div>
    </div>
    <div class="submenu">
      <ul>
        <slot />
      </ul>
    </div>
  </li>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
})
</script>

<style lang="stylus" scoped>
@import "~@vue/ui/src/style/imports"

ul
  margin 0
  padding 0
  list-style outside none none
.title
  margin 2px -24px
  padding 12px 49px 12px 24px
  position relative
  vertical-align middle
  line-height 1.5em
  .vue-ui-icon
    width 1.5em
    height 1.5em
    margin-right 5px
    vertical-align middle
    display inline-block
    svg
      width 100%
      height 100%
  .expand-icon
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
      svg
        width 20px
        height 20px
.title:hover
  background-color lookup('$vue-ui-gray-100')
li
  margin 2px 0
  padding 0 24px
.submenu li
  margin 2px -24px
  padding 12px 48px
</style>
