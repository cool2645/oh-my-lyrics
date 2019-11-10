<template>
  <li :class="rootClassName" @click="onClick">
    <slot />
  </li>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    selected: Boolean
  },
  computed: {
    rootClassName () {
      return this.selected ? 'menu-item selected' : 'menu-item'
    }
  },
  methods: {
    onClick (e: MouseEvent) {
      this.$emit('click', e)
    }
  }
})
</script>

<style lang="stylus" scoped>
@import "~@vue/ui/src/style/imports"

li.menu-item
  margin 2px 0
  padding 12px 24px
  position relative
  vertical-align middle
  line-height 1.5em
  user-select none
  .vue-ui-icon
    width 1.5em
    height 1.5em
    margin-right 5px
    vertical-align middle
    display inline-block
    svg
      width 100%
      height 100%
li.menu-item.selected
  background-color lookup('$vue-ui-primary-500')
  color #fff
  svg
    fill #fff
li.menu-item:hover
  background-color lookup('$vue-ui-primary-400')
  color #fff
  svg
    fill #fff
.submenu li.menu-item
  margin 2px -24px
  padding 12px 48px
</style>
