<template>
  <li class="menu-item-submenu">
    <div class="title" @click="toggleCollapse">
      <slot name="title" />
      <div class="expand-icon">
        <VueIcon :icon="mCollapse ? 'keyboard_arrow_down' : 'keyboard_arrow_up'"/>
      </div>
    </div>
    <transition name="collapse" tag="div">
      <div class="submenu" v-if="!mCollapse">
        <ul class="submenu-list">
          <slot />
        </ul>
      </div>
    </transition>
  </li>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    collapse: Boolean
  },
  watch: {
    collapse (newValue) {
      this.mCollapse = newValue
    }
  },
  data () {
    return {
      mCollapse: this.collapse
    }
  },
  computed: {
    submenuClass () {
      const classNames = ['submenu']
      if (this.mCollapse) classNames.push('collapse')
      return classNames.join(' ')
    }
  },
  methods: {
    toggleCollapse () {
      this.mCollapse = !this.mCollapse
      this.$emit('update:collapse', this.mCollapse)
    }
  }
})
</script>

<style lang="stylus" scoped>
@import "~@vue/ui/src/style/imports"

.submenu-list
  margin 0
  padding 0
  list-style outside none none
.title
  margin 2px -24px
  padding 12px 49px 12px 24px
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
.menu-item-submenu
  margin 2px 0
  padding 0 24px
.collapse-enter-active, .collapse-leave-active
  transition transform .3s ease-in-out
  transform-origin top
.collapse-enter, .collapse-leave-to
  transform scaleY(0)
</style>
