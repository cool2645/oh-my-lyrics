<template>
  <div class="editor-page">
    <p>每句歌词独占一行。空行表示间奏。</p>
    <div class="editor" contenteditable="true" ref="editor"
         @paste="onPaste" @input="onInput" spellcheck="false"
    >
    </div>
    <div class="blank"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  mounted () {
    (this.$refs.editor as HTMLElement).focus()
  },
  methods: {
    onPaste (e: ClipboardEvent) {
      e.preventDefault()
      const text = e.clipboardData?.getData('text/plain')
      if (!text) return
      const lines = text.split('\n')
      if (!lines || !lines.length) return
      document.execCommand('insertText', false, lines.shift())
      lines.forEach(line => {
        document.execCommand('insertParagraph', false)
        document.execCommand('insertText', false, line)
      })
    },
    onInput (e: InputEvent) {
    }
  }
})
</script>

<style lang="stylus" scoped>
@import "~@vue/ui/src/style/imports"

.blank
  width 100%
  height 60vh
.editor
  margin 20px 0
  padding 18px 24px
  border 1px solid lookup('$vue-ui-gray-100')
  min-height 500px
  font-size 1.35rem
  font-family serif
  outline 0
  >>> p, >>> div
    margin .35em 0
</style>
