<template>
  <li :class="rootClassName">
    <slot />
  </li>
</template>

<script>
export default {
  computed: {
    rootClassName () {
      return this.selected ? 'selected' : ''
    }
  },
  props: {
    selected: Boolean
  }
}
</script>

<style lang="stylus" scoped>
@import "~@vue/ui/src/style/imports"

li
  margin 2px 0
  padding 12px 24px
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
li.selected
  background-color lookup('$vue-ui-primary-500')
  color #fff
  svg
    fill #fff
li:hover
  background-color lookup('$vue-ui-primary-400')
  color #fff
  svg
    fill #fff
</style>
