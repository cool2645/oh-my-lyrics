<template>
  <div class="menu">
    <ul class="menu-list">
      <slot />
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
})
</script>

<style lang="stylus" scoped>
@import "~@vue/ui/src/style/imports"

.menu
  border-left 1px solid lookup('$vue-ui-gray-100')
  border-right 1px solid lookup('$vue-ui-gray-100')
.menu-list
  margin 0
  padding 0
  list-style outside none none
</style>
