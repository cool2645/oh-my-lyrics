<template>
  <div class="menu">
    <ul>
      <slot />
    </ul>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="stylus" scoped>
@import "~@vue/ui/src/style/imports"

.menu
  border-left 1px solid lookup('$vue-ui-gray-100')
  border-right 1px solid lookup('$vue-ui-gray-100')
ul
  margin 0
  padding 0
  list-style outside none none
</style>
