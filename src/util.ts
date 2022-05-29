import { html, nothing } from 'lit';
import { DesignLine, DesignStructure } from './types';
import {unsafeHTML} from 'lit/directives/unsafe-html.js'
import { hasJapanese } from 'asian-regexps';
import { speakJapanese } from './speech';

export function convertTextToDesignStructure (text: string): DesignStructure|null {
  let structure: any
  try {
    // split to empty lines
    structure = text.split('\n\n')
    structure = structure.map(chunk=>{
      let parts = chunk.split('\n')
      // convert any enclosing punctuations
      parts = parts.map(p=> {
        return p.replace(/(\*[^\*]+\*)/g, function (a, b) {
          return `<s-s class="notice" c="var(--notice-color)">${a.replace(/\*/g, '')}</s-s>`
        })
      })
      return {
        word: parts[0],
        second: parts[1],
        meaning: parts[2]
      } as DesignLine
    })
    return structure as DesignStructure
  } catch (e) {
    // if any bad things happen we just ignore quit
    return null
  }
}


export function DesignLineTemplate (line: DesignLine) {
  return html`
  <div class=line>
    <header>
      <div class=word>${unsafeHTML(line.word)}</div>
      <div class=second>${unsafeHTML(line.second)}</div>
    </header>
    <div class=meaning>${unsafeHTML(line.meaning)}</div>
  </div>
  `
}

export function DesignTemplate (struct: DesignStructure|null) {
  if (struct == null) {
    return nothing;
  }
  return html`
  <div id=struct>
  ${struct.map((line,i)=>{
    return html`
    ${DesignLineTemplate(line)}
    ${i!=struct.length-1 ? html`<div class=separator></div>` : nothing}
    `
  })}
  </div>
  `
}

const audioMap: {[word: string]: HTMLAudioElement|Blob} = {}

export async function playJapaneseAudio (word) {
  let audio: HTMLAudioElement
  if (word in audioMap) {
    if (audioMap[word] instanceof Blob) {
      audio = createAudioElementFromBlob(audioMap[word] as Blob)
    }
    else {
      audio = audioMap[word] as HTMLAudioElement
    }
    // audio = audioMap[word]
  }
  else {
    const response = await fetch(`https://assiets.vdegenne.com/data/japanese/audio/${encodeURIComponent(word)}`)
    const blob = audioMap[word] = await response.blob()
    audio = createAudioElementFromBlob(blob)
    // audio = new Audio(`https://assiets.vdegenne.com/data/japanese/audio/${encodeURIComponent(word)}`)
  }

  return new Promise((resolve, reject) => {
    audio.onerror = () => reject()
    audio.onended = () => {
      resolve(audio)
      // if (!(word in audioMap)) {
      //   audioMap[word] = audio
      // }
    }
    audio.play()
  })
}
export function createAudioElementFromBlob (blob: Blob) {
  return new Audio(URL.createObjectURL(blob))
}


export async function sleep (ms: number = 1000) {
  await new Promise(r=>setTimeout(r, ms))
}


export function convertPunctuationsToTags (htmlStr: string) {
  htmlStr = htmlStr.replace(/(\*[^\*]+\*)/g, function (a, b) {
    return `<span class="notice" notice>${a.replace(/\*/g, '')}</span>`
  })
  htmlStr = htmlStr.replace(/(_[^_]+_)/g, function (a, b) {
    return `<span underline>${a.replace(/_/g, '')}</span>`
  })
  return htmlStr
}
export function removePunctuationsFromString (str: string) {
  return str.replace(/\*/g, '').replace(/_/g, '')
}


// export async function playAudio (text: string) {
//   text = removePunctuationsFromString(text)
//   if (hasJapanese(text)) {
//     try {
//       await playJapaneseAudio(text)
//     } catch (e) {
//       await speakJapanese(text)
//     }
//   }
// }

export const playTypes = ['auto', 'speech', 'external'] as const
export function play(text: string, beforeWaitMs = 0, pauseMs = 2000, afterWaitMs = 0) {
  let typeIndex = parseInt(text)
  if (isNaN(typeIndex)) {
    typeIndex = 0 // auto
  }
  else {
    text = text.slice(1)
  }
  const type = playTypes[typeIndex]
  text = removePunctuationsFromString(text)
  return async function () {
    // @ts-ignore
    highlightElement(this)
    await sleep(beforeWaitMs)
    switch (type) {
      case 'auto':
        // try {
        //   // @TODO : play appropriate language
        //   await playJapaneseAudio(text)
        // } catch (e) {
        //   // @TODO : play appropriate language
        //   await speakJapanese(text, 1)
        // }
        playJapanese(text)
        break

        case 'speech':
          // @TODO : play appropriate language
          await speakJapanese(text)
          break

        case 'external':
          (new Audio(`../audio/${text}`)).play()
          break
    }

    await sleep(pauseMs)
    // @ts-ignore
    unhighlightElement(this)
    await sleep(afterWaitMs)
  }
}


export function highlightElement(el: HTMLElement) {
  el.setAttribute('hl', '')
}
export function unhighlightElement(el: HTMLElement) {
  el.removeAttribute('hl')
}


export async function playJapanese (word: string) {
  try {
    await playJapaneseAudio(word)
  } catch (e) {
    await speakJapanese(word)
  }
}