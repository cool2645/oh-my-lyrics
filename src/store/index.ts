import Vue from 'vue'
import Vuex from 'vuex'
import { getField, updateField } from 'vuex-map-fields'
import VuexPersistence from 'vuex-persist'

import { Lyrics } from '@/model'

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
