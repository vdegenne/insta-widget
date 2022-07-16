import { css, html, LitElement, globalStyles } from "../../app.js";
import {Words, getExactSearch} from '../../node_modules/japanese-data-module/dist/data.js'

let words = []
if (localStorage.getItem('insta-widget:train')) {
  words = JSON.parse(localStorage.getItem('insta-widget:train'))
}
const alternatingColors = ['black', '#78909c']

class PostElement extends LitElement {
  static styles = [globalStyles, css`
    canvas-element {
      background-color: white;
    }
    #candidates > mwc-button {
      margin: 2px;
    }
  `]

  get dialog () { return this.shadowRoot.querySelector('mwc-dialog')}

  render () {
    let candidates = []
    if (words.length) {
      let word = words[words.length - 1]
      candidates = Words.filter(w => w[1].startsWith(word[word.length - 1]) && w[1].length == 2).map(w=>w[1])
    }
    return html`
    <canvas-element>
      <page-element active flex column between pad=28>
      ${words.map((w, i) => {
        const word = getExactSearch(w)
        return html`
        <div class=word flex fullwidth style="justify-content:stretch;">
          <div style="margin-right:24px;white-space:nowrap;position:relative;top:-4px" flex>
          ${word[1].split('').map((l, j) => html`
          <w-span t=${l} fw=600 fs=2em c=${alternatingColors[Math.abs(i%2 - j)]}></w-span>
          `)}
          </div>
          <w-span t=${word[3]}></w-span>
        </div>
        `
      })}
      </page-element>
    </canvas-element>
    <div controls>
      <mwc-icon-button icon=settings @click=${()=>{this.dialog.show()}}></mwc-icon-button>
    </div>

    <mwc-dialog>
      ${words.length <= 1 ? html`
      <mwc-button unelevated icon=casino
        @click=${()=>{this.pickRandomWord()}}>random word</mwc-button>
      ` : ''}
      ${words.map(w => {
        return html`
        <mwc-textfield disabled value=${w} style="display:block"></mwc-textfield>
        `
      })}
      <div id=candidates>
      ${words.length > 1 ? html`
        <mwc-button unelevated @click=${()=>{
          words.pop()
          this.requestUpdate()
        }}><mwc-icon>arrow_back</mwc-icon></mwc-button>
      ` : ''}
      ${candidates.map(c=> {
        return html`<mwc-button unelevated @click=${()=>{
          words.push(c)
          this.requestUpdate()
        }}>${c}</mwc-button>`
      })}
      </div>


      <mwc-button unelevated slot="primaryAction"
        @click=${()=>{this.submit()}}>submit</mwc-button>
    </mwc-dialog>
    `
  }

  pickRandomWord () {
    const jlpts = [5, 4, 3]
    const candidates = Words.filter(w=>jlpts.includes(w[2]) && w[1].length == 2)
    words = [candidates[~~(Math.random() * candidates.length)][1]]
    this.requestUpdate()
  }

  submit () {
    this.dialog.close()
    this.saveSettings()
  }

  saveSettings () {
    localStorage.setItem('insta-widget:train', JSON.stringify(words))
  }
}


customElements.define('post-element', PostElement)