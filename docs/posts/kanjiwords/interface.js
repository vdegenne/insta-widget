import { css, html, LitElement, globalStyles, saveFrame, unsafeHTML } from "../../app.js";
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
  get textfield () { return this.shadowRoot.querySelector('mwc-textfield#kanji') }
  get canvasElement () { return this.shadowRoot.querySelector('canvas-element')}

  static styles = [globalStyles, css`
  canvas-element {
    background-color: ghostwhite;
  }
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
  #meanings {
    justify-content: stretch;
  }
  #meanings > div {
    background-color: #b71c1c;
    color:ghostwhite;
    margin: 5px;
    padding: 2px 12px;
    border-radius: 5px;
  }
  [highlight] {
    color: #b71c1c !important;
  }
  `]

  render () {
    return html`
    <canvas-element flex column>
      ${(() => {
        if (data.kanji.length == 0) { return '' }
        const kanji = Kanjis.find(k=>k[1]==data.kanji)
        const meanings = kanji[3].split('//')[0].split(/[;,]/g).map(e=>e.trim())
        return html`
        <header flex fullwidth between style="font-size:2.3em">
          <w-span t=${kanji[1]} fs="5em" style="margin:0 32px 0;line-height:231px;" c=#b71c1c></w-span>
          <div id=meanings style="flex-wrap:wrap" flex>
          ${meanings.slice(0,5).map(m=> {
            if (m.length > 10) return ''
            return html`<div style="white-space:nowrap">${m}</div>`
          })}
          </div>
        </header>
        `
      })()}
      <div id="words" flex column fullwidth style="justify-content:space-evenly">
      ${data.words.slice(0,5).map(w => {
        const word = getExactSearch(w)
        if (!word) { return '' }
        const meaning = word[3]?.split('//')[0];
        return html`
        <div class=word flex fullwidth style="justify-content:stretch">
          <div flex style="white-space:nowrap">
              <span style="font-size:3.5em;font-weight:600;color:black;position:relative;top:-6px" jp>${unsafeHTML(word[1].replaceAll(new RegExp(data.kanji, 'g'), match => `<span highlight>${match}</span>`))}</span>
            <!-- <w-span t=${word[1]} fs="3.5em" style=";border-radius:3px;padding:0 5px;position:relative;top:-6px;" c=black fw=600></w-span> -->
            <w-span t="[ ${toRawRomaji(word[4])} ]" fs="1.5em" style="margin:0 12px;padding:4px;background:#ffc107" c=white></w-span>
          </div>
          <w-span t=${meaning} fs="2em" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"></w-span>
        </div>
        `
      })}
      </div>
      <div style="position:absolute;bottom:0;right:0;">@chikojap</div>
    </canvas-element>
    <div>
      <mwc-icon-button icon=settings @click=${()=>{this.dialog.show()}}></mwc-icon-button>
      <mwc-icon-button icon=save @click=${()=>{saveFrame(this.canvasElement)}}></mwc-icon-button>
    </div>

    <mwc-dialog>
      <div flex>
        <mwc-textfield label="kanji" id=kanji value=${data.kanji}></mwc-textfield>
        <mwc-icon-button icon="search" @click=${()=>{this.search()}}></mwc-icon-button>
      </div>

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

  search () {
    // if (e.code == 'Enter') {
      data.kanji = this.textfield.value
      data.words = Words.filter(w=>w[1].indexOf(this.textfield.value) >= 0).map(w=>w[1])
      this.requestUpdate()
    // }
  }

  submit () {
    this.dialog.close()
    saveData()
  }
}

window.customElements.define('post-element', KanjiWords)