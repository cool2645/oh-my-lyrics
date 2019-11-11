declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module '@vue/ui' {
  const x: any
  export default x
}

declare module 'vue-resize' {
  const x: any
  export default x
}

declare module 'vuex-map-fields' {
  const { getField, updateField, createHelpers }: any
  export { getField, updateField, createHelpers }
}
