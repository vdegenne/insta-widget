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

export function generateOutlineStyle (color = '#000', r = 3) {
  const n = Math.ceil(2 * Math.PI * r) /* number of shadows */
  let str = ''
  for (let i = 0; i < n; i++) /* append shadows in n evenly distributed directions */ {
    const theta = 2 * Math.PI * i / n
    str += (r * Math.cos(theta)) + "px " + (r * Math.sin(theta)) + "px 0 " + color + (i == n - 1 ? "" : ",")
  }
  return str
  // document.querySelector("#myoutlinedtext").style.textShadow = str
}