export interface Extension {
  [key: string]: string
}

export interface Phoneme {
  timeShift: number
  duration: number
  value: string
}

export interface Ruby {
  name: string
  rt: string[]
}

export interface Word {
  phonemes: (Phoneme & Extension)[]
  rubies: Ruby[]
}

export interface Translation {
  lang: string
  value: string
}

export interface Sentence {
  timeShift: number
  duration: number
  words: (Word & Extension)[]
  translations: Translation[]
}

export interface Lyrics {
  lang: string
  locales: { [key: string]: string }
  artist: string
  title: string
  album: string
  lyricist: string
  composer: string
  arranger: string
  by: string
  sentences: (Sentence & Extension)[]
}

export default class {
  parse (str: string): Lyrics {
    throw new Error('failed to parse')
  }
  stringify (lyrics: Lyrics): string {
    return ''
  }
}
