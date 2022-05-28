import { LitElement, css, globalStyles, sleep } from "../../app.js";
import { highlight, unhighlight } from "../../util.js"

export class PostElement extends LitElement {

  elements = [
    { w: '*長*い', s: 'ながい', m: 'long' },
    { w: '*苦*い', s: 'にがい', m: 'bitter' },
    { w: '*願*い', s: 'ねがい', m: 'desire' },
    { w: '*投*げる', s: 'なげる', m: 'to throw' },
    { w: '*逃*げる', s: 'にげる', m: 'to escape' },
    { w: '*殴*る', s: 'なぐる', m: 'to strike' },
  ]

  static styles = [globalStyles, css`
    canvas-element {
      background-color: black;
      color: white;
      font-size: 50px;
      padding: 27px;
      --hl-color: #ffeb3b;
    }
    [notice] {
      background-color: #e0e0e0;
      color: black
    }
    w-span {
      color: #eeeeee;
    }
    w-span:first-of-type {
      min-width: 200px;
    }
    w-span:nth-child(2) {
      flex: 1;
    }
  `]

  render() {
    return html`
    <canvas-element flex column between>
      ${this.elements.map((e, i) => {
        return html`
        <div class="row" fullwidth between>
          <w-span t=${e.m} fs=0.6em></w-span>
          <w-span t=${e.w} fw=500></w-span>
          <w-span t=${e.s}></w-span>
        </div>
        `
      })}
    </canvas-element>
    `
  }

  async operate () {
    ;(new Audio(`${cwd()}/speech.mp3`)).play();
    const rows = this.shadowRoot.querySelectorAll('.row')
    for (const row of rows) {
      const hiragana = row.querySelector('w-span:nth-child(3)')
      // await play(hiragana.textContent, 0, 0).call(hiragana)
      highlight(hiragana)
      await sleep(1800)
      unhighlight(hiragana)
    }
  }
}


window.customElements.define('post-element', PostElement);

export function cwd () {
  const url = new URL(import.meta.url)
  return `${url.origin}${url.pathname.split('/').slice(0, -1).join('/')}`
}