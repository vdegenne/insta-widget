import { css, html, LitElement, globalStyles, saveFrame } from "../../app.js";
import {Kanjis, Words, getExactSearch} from '../../node_modules/japanese-data-module/dist/data.js'
import {toRawRomaji} from '../../node_modules/kuroshiro/src/util.js'

let data = { kanji: '', words: [] }
const localData = localStorage.getItem('insta-widget:kanjiwords')
if (localData) { data = JSON.parse(localData) }
function saveData () { localStorage.setItem('insta-widget:kanjiwords', JSON.stringify(data)) }




export class KanjiWords extends LitElement {
  static properties = {

  }

  get dialog () { return this.shadowRoot.querySelector('mwc-dialog') }
  get canvasElement () { return this.shadowRoot.querySelector('canvas-element')}

  static styles = [globalStyles, css`
  mwc-textfield {
    width: 100%;
  }
  h1 {
    margin: 0;
  }
  #words {
    flex: 1;
    padding: 24px;
    box-sizing: border-box;
  }
  #meanings > div {
    background-color: black;
    color:#ffedb7;
    margin: 5px;
    padding: 2px 12px;
    border-radius: 3px;
  }
  `]

  render () {
    return html`
    <canvas-element flex column>
      <h1 jp>${(() => {
        if (data.kanji.length == 0) { return '' }
        const kanji = Kanjis.find(k=>k[1]==data.kanji)
        const meanings = kanji[3].split('//')[0].split(/[;,]/g).map(e=>e.trim())
        return html`
        <header flex style="">
          <w-span t=${kanji[1]} fs="5em" style="margin:0 28px 0"></w-span>
          <div id=meanings style="flex-wrap:wrap" flex>
          ${meanings.slice(0,5).map(m=> {
            return html`<div style="white-space:nowrap">${m}</div>`
          })}
          </div>
        </header>
        `
      })()}</h1>
      <div id="words" flex column fullwidth style="justify-content:space-evenly">
      ${data.words.slice(0,4).map(w => {
        const word = getExactSearch(w)
        if (!word) { return '' }
        const meaning = word[3]?.split('//')[0];
        return html`
        <div class=word flex fullwidth style="justify-content:stretch">
          <div flex style="white-space:nowrap">
            <w-span t=${word[1]} fs="3em" style=";border-radius:3px;padding:0 5px;" c=black fw=600></w-span>
            <w-span t="[ ${toRawRomaji(word[4])} ]" fs="1.5em" style="margin:0 12px;padding:4px;background:#616D3D" c=white></w-span>
          </div>
          <w-span t=${meaning} fs="2em" style="background:#ffbf0042;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"></w-span>
        </div>
        `
      })}
      </div>
    </canvas-element>
    <div>
      <mwc-icon-button icon=settings @click=${()=>{this.dialog.show()}}></mwc-icon-button>
      <mwc-icon-button icon=save @click=${()=>{saveFrame(this.canvasElement)}}></mwc-icon-button>
    </div>

    <mwc-dialog>
      <mwc-textfield label="kanji"
        value=${data.kanji}
        @keyup=${e => {this.onKanjiKeyUp(e)}}></mwc-textfield>

      ${data.words.map((w, i) => {
        const word = getExactSearch(w)
        return html`
        <div flex style="margin: 4px 0;">
          <mwc-textfield value=${word[1]}></mwc-textfield>
          <mwc-icon-button icon=delete @click=${() => {
            data.words.splice(i, 1)
            this.requestUpdate()
          }}></mwc-icon-button>
        </div>
        `
      })}
      <mwc-button unelevated slot="secondaryAction"
        @click=${()=>{this.submit()}}>submit</mwc-button>
    </mwc-dialog>
    `
  }

  onKanjiKeyUp (e) {
    if (e.code == 'Enter') {
      data.kanji = e.target.value
      data.words = Words.filter(w=>w[1].indexOf(e.target.value) >= 0).map(w=>w[1])
      this.requestUpdate()
    }
  }

  submit () {
    this.dialog.close()
    saveData()
  }
}

window.customElements.define('post-element', KanjiWords)