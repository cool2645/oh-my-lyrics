<template>
  <div class="editor-page">
    <p>每句歌词独占一行。空行表示间奏。</p>
    <div class="editor" ref="editor"></div>
    <div class="blank"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CodeMirror, { Editor } from 'codemirror'
import 'codemirror/lib/codemirror.css'
import { mapMutations } from 'vuex'

export default Vue.extend({
  data (): {
    codeMirror: Editor | null
    } {
    return {
      codeMirror: null
    }
  },
  computed: {
    currentTabId () {
      return this.$store.state.currentTabId
    }
  },
  watch: {
    currentTabId () {
      this.codeMirror?.setValue(this.$store.getters.currentDocumentText)
    }
  },
  mounted () {
    this.codeMirror = CodeMirror(this.$refs.editor as HTMLDivElement, {
      value: this.$store.getters.currentDocumentText,
      mode: null
    })
    this.codeMirror.on('change', (_, change) => {
      if (change.origin === 'setValue') return
      console.table({
        selection: [
          `${change.from.line}:${change.from.ch}`,
          `${change.to.line}:${change.to.ch}`
        ],
        removed: change.removed,
        text: change.text
      })
      ;(this as any).updateLyrics(change)
      if (this.codeMirror?.getDoc().getValue() !== this.$store.getters.currentDocumentText) {
        const err = new Error(this.$store.getters.currentDocumentText)
        err.name = 'LyricsUpdateError'
        console.error(err)
        window.alert('编辑器发生错误，为确保数据一致性，请刷新页面')
      }
    })
  },
  methods: {
    ...mapMutations({
      updateLyrics: 'LYRICS_MUTATION'
    })
  }
})
</script>

<style lang="stylus" scoped>
@import "~@vue/ui/src/style/imports"

.blank
  width 100%
  height 60vh
.editor >>> .CodeMirror
  margin 20px 0
  padding 18px 24px
  border 1px solid lookup('$vue-ui-gray-100')
  height auto
  font-size 1.35rem
  line-height 1.75em
  font-family serif
  outline 0
</style>
