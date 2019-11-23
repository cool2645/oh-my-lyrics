import Vue from 'vue'
import Vuex from 'vuex'
import { getField, updateField } from 'vuex-map-fields'
import VuexPersistence from 'vuex-persist'

import { Extension, Lyrics, Phoneme, Ruby, Sentence, Word } from '@/model'

const cloneDeep = (obj: any) => {
  return JSON.parse(JSON.stringify(obj))
}

export type EditorMode =
  | 'HEAD'
  | 'LYRICS'
  | 'SPLIT_WORDS'
  | 'SPLIT_PHONEMES'
  | 'TIMELINE'
  | 'RUBY'
  | 'TRANSLATE'

export type StartMenu =
  | 'WELCOME'
  | 'NEW'
  | 'IMPORT'
  | 'EXPORT'
  | 'PREFERENCES'
  | 'ABOUT'

export interface Tab {
  _id: string
  editorMode: EditorMode
  rubies: string[]
  rubyId: number
  translations: string[]
  translateId: number
  document: Lyrics
}

export interface State {
  font: 'Serif' | 'Sans Serif'
  tabs: Tab[],
  currentTabId: number,
  newDocumentCount: number,
  startMenu: StartMenu
}

export const START_MENU = -1

Vue.use(Vuex)

const vuexLocal = new VuexPersistence<State>({
  strictMode: process.env.NODE_ENV !== 'production',
  storage: window.localStorage
})

export default new Vuex.Store<State>({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    font: 'Serif',
    tabs: [],
    currentTabId: START_MENU,
    newDocumentCount: 0,
    startMenu: 'WELCOME'
  },
  getters: {
    currentTab (state) {
      return state.tabs[state.currentTabId]
    },
    currentDocument (_, getters) {
      return getters.currentTab?.document
    },
    currentDocumentText (_, getters) {
      if (!getters.currentDocument) return ''
      return getters.currentDocument.sentences.map((sentence: Sentence) => (
        sentence.words.map(word => (word.phonemes.map(phoneme => phoneme.value).join(''))).join('')
      )).join('\n')
    },
    getField,
    getCurrentDocumentField (state, getters) {
      return getters.currentDocument ? getField(getters.currentDocument) : undefined
    }
  },
  mutations: {
    updateField,
    updateCurrentDocumentField (state, field) {
      if (state.tabs[state.currentTabId]) {
        updateField(state.tabs[state.currentTabId].document, field)
      }
    },
    NEW_DOCUMENT (state) {
      state.newDocumentCount++
    },
    OPEN_TAB (state, payload: { tab: Tab, id: number }) {
      state.tabs.splice(payload.id, 0, payload.tab)
      state.currentTabId = payload.id
    },
    CLOSE_TAB (state, id) {
      if (state.currentTabId >= id) {
        state.currentTabId = state.currentTabId - 1 < 0 && state.tabs.length > 1
          ? 0 : state.currentTabId - 1
      }
      Vue.delete(state.tabs, id)
    },
    ACTIVATE_TAB (state, id) {
      state.currentTabId = id
    },
    REORDER_TAB (state, direction: number) {
      if (direction > 0 && state.currentTabId !== state.tabs.length - 1) {
        const temp = state.tabs[state.currentTabId]
        Vue.set(state.tabs, state.currentTabId, state.tabs[state.currentTabId + 1])
        Vue.set(state.tabs, state.currentTabId + 1, temp)
        state.currentTabId++
        return
      }
      if (direction < 0 && state.currentTabId !== 0) {
        const temp = state.tabs[state.currentTabId]
        Vue.set(state.tabs, state.currentTabId, state.tabs[state.currentTabId - 1])
        Vue.set(state.tabs, state.currentTabId - 1, temp)
        state.currentTabId--
      }
    },
    UPDATE_EDITOR_MODE (state, { editorMode, id }: { editorMode: EditorMode, id: number }) {
      state.tabs[state.currentTabId].editorMode = editorMode
      if (editorMode === 'RUBY') state.tabs[state.currentTabId].rubyId = id
      if (editorMode === 'TRANSLATE') state.tabs[state.currentTabId].translateId = id
    },
    UPDATE_START_MENU (state: State, startMenu: StartMenu) {
      state.startMenu = startMenu
    },
    // MUST COMPLY WITH 2 REQUIREMENTS
    // 1. STATE AFTER ADDED AND THEN DELETED THE SAME TEXT MUST REMAIN THE SAME
    // 2. STATE AFTER ADDED SOME TEXT CHARACTER-BY-CHARACTER MUST REMAIN THE SAME
    //    AS ADDED THE SAME TEXT BY PASTE IN ONE MOVE
    LYRICS_MUTATION (state: State, change: {
      from: { line: number, ch: number },
      to: { line: number, ch: number },
      text: string[]
    }) {
      const document = state.tabs[state.currentTabId].document
      if (document.sentences.length === 0) {
        document.sentences.push({
          words: [],
          translations: []
        } as any)
      }
      // remove and figure out where to add
      let line = document.sentences[change.from.line]
      let wordStart = 0
      let phonemeStart = 0
      let charStart = 0
      let startedRemove = false
      for (let i = change.from.line; i <= change.to.line; i++) {
        const fromCh = i === change.from.line ? change.from.ch : 0
        const toCh = i === change.to.line ? change.to.ch : Infinity
        let it = 0
        for (let j = wordStart; j < line.words.length; j++) {
          const word = line.words[j]
          for (let k = 0; k < word.phonemes.length; k++) {
            const phoneme = word.phonemes[k]
            // skip not to remove ones
            if (it + phoneme.value.length <= fromCh) {
              it += phoneme.value.length
              if (!startedRemove) phonemeStart++
              continue
            }
            const s1 = it < fromCh ? phoneme.value.substr(0, fromCh - it) : ''
            const s2 = it >= toCh ? phoneme.value
              : it + phoneme.value.length > toCh ? phoneme.value.substr(toCh) : ''
            if (!startedRemove) {
              charStart = s1.length
              startedRemove = true
            }
            // remove entire phoneme
            if (s1 + s2 === '') {
              it += phoneme.value.length
              word.phonemes.splice(k, 1)
              word.rubies.splice(k, 1)
              k--
              if (!startedRemove) startedRemove = true
              continue
            }
            if (s1 + s2 !== phoneme.value) {
              Vue.set(phoneme, 'value', s1 + s2)
            }
          }
          // remove empty word
          if (word.phonemes.length === 0) {
            line.words.splice(j, 1)
            j--
            continue
          }
          if (!startedRemove || phonemeStart >= word.phonemes.length) {
            wordStart++
            phonemeStart = 0
          }
        }
        if (i !== change.to.line) {
          line.words.push(...document.sentences[change.from.line + 1].words)
          document.sentences.splice(change.from.line + 1, 1)
        }
      }
      // add
      if (phonemeStart !== 0) {
        if (charStart !== 0) {
          line.words[wordStart].phonemes.splice(phonemeStart, 1, ...[
            { value: line.words[wordStart].phonemes[phonemeStart].value.substr(0, charStart) },
            { value: line.words[wordStart].phonemes[phonemeStart].value.substr(charStart) }
          ])
          phonemeStart++
        }
        line.words.splice(wordStart, 1, ...[
          {
            phonemes: line.words[wordStart].phonemes.slice(0, phonemeStart),
            rubies: line.words[wordStart].rubies.slice(0, phonemeStart)
          } as Word & Extension,
          {
            phonemes: line.words[wordStart].phonemes.slice(phonemeStart),
            rubies: line.words[wordStart].rubies.slice(phonemeStart)
          } as Word & Extension
        ])
        wordStart++
      }
      for (let i = 0; i < change.text.length; i++) {
        if (i !== 0) {
          const nextLineWords = line.words.splice(wordStart)
          document.sentences.splice(change.from.line + i, 0, {
            words: nextLineWords,
            translations: cloneDeep(line.translations)
          } as Sentence & Extension)
          wordStart = 0
        }
        line = document.sentences[change.from.line + i]
        const words = change.text[i].split('')
        line.words.splice(wordStart, 0, ...words.map(char => ({
          phonemes: [{
            value: char
          }],
          rubies: []
        } as any)))
        wordStart += words.length
      }
    },
    RESTORE_MUTATION: vuexLocal.RESTORE_MUTATION
  },
  actions: {
    newLyrics ({ commit, dispatch, state }) {
      commit('NEW_DOCUMENT')
      dispatch('openLyrics', {
        lang: navigator.language,
        locales: {},
        artist: '',
        title: `Document ${state.newDocumentCount}`,
        album: '',
        lyricist: '',
        composer: '',
        arranger: '',
        by: '',
        sentences: []
      })
    },
    openLyrics ({ commit, state }, lyrics: Lyrics) {
      const tab: Tab = {
        _id: (+new Date()) + '' + Math.random(),
        editorMode: 'HEAD',
        rubies: [],
        rubyId: -1,
        translations: [],
        translateId: -1,
        document: lyrics
      }
      commit('OPEN_TAB', {
        tab,
        id: state.currentTabId + 1
      })
    }
  },
  modules: {
  },
  plugins: [
    vuexLocal.plugin
  ]
})
