import { html } from './app.js';
export async function sleep (ms) {
  await new Promise(resolve=>setTimeout(resolve, ms))
}

export function highlight (el) {
  el.setAttribute('hl', '')
}
export function unhighlight (el) {
  el.removeAttribute('hl')
}

export function removePunctuationsFromString (str) {
  return str.replace(/\*/g, '').replace(/_/g, '')
}


export function buildImageLink (name, extension='png') {
  return `../images/${name}.${extension}`
}


export { html }

