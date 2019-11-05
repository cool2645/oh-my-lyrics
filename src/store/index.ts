import Vue from 'vue'
import Vuex from 'vuex'
import { Lyrics } from '@/model'

export type EditorMode =
  | 'HEAD'
  | 'LYRICS'
  | 'SPLIT_WORDS'
  | 'SPLIT_PHONEMES'
  | 'TIMELINE'
  | 'RUBY'
  | 'TRANSLATE'

export interface WelcomeTab {
  type: 'welcome'
}

export interface DocumentTab {
  type: 'document'
  editorMode: EditorMode
  rubyId: number
  translateId: number
  document: Lyrics
}

export type Tab = DocumentTab | WelcomeTab

export interface State {
  font: 'Serif' | 'Sans Serif'
  tabs: Tab[],
  currentTabId: number
}

Vue.use(Vuex)

export default new Vuex.Store<State>({
  state: {
    font: 'Serif',
    tabs: [{
      type: 'welcome'
    }],
    currentTabId: 0
  },
  mutations: {
    OPEN_TAB (state, payload: { tab: Tab, id: number }) {
      state.tabs.splice(payload.id, 0, payload.tab)
      state.currentTabId = state.tabs.length > 1 ? payload.id : 0
    },
    CLOSE_TAB (state, id) {
      if (id !== 0) state.currentTabId = id - 1
      Vue.delete(state.tabs, id)
    }
  },
  actions: {
    newLyrics ({ dispatch }) {
      dispatch('openLyrics', {
        lang: navigator.language,
        locales: {},
        artist: '',
        title: '',
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
        type: 'document',
        editorMode: 'HEAD',
        rubyId: 0,
        translateId: 0,
        document: lyrics
      }
      commit('OPEN_TAB', {
        tab,
        id: state.currentTabId + 1
      })
    },
    closeLyrics ({ commit }, id: number) {
      commit('CLOSE_TAB', id)
    }
  },
  modules: {
  }
})
