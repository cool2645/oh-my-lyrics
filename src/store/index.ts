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

export interface Tab {
  _id: string
  editorMode: EditorMode
  rubyId: number
  translateId: number
  document: Lyrics
}

export interface State {
  font: 'Serif' | 'Sans Serif'
  tabs: Tab[],
  currentTabId: number,
  newDocumentCount: number
}

export const START_MENU = -1

Vue.use(Vuex)

export default new Vuex.Store<State>({
  state: {
    font: 'Serif',
    tabs: [],
    currentTabId: START_MENU,
    newDocumentCount: 0
  },
  mutations: {
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
    REORDER_TAB (state, direction) {

    }
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
        rubyId: 0,
        translateId: 0,
        document: lyrics
      }
      commit('OPEN_TAB', {
        tab,
        id: state.currentTabId + 1
      })
    }
  },
  modules: {
  }
})
