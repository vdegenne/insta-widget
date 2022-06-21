import { copyToClipboard } from '../../app.js'
import {LitElement, globalStyles, css, speakJapanese } from '../../app.js'
import {getExactSearch} from '../../node_modules/japanese-data-module/dist/data.js'
import {toRawRomaji} from '../../node_modules/kuroshiro/src/util.js'
import { instaHashTags } from '../../util.js'
console.clear()

export class PostElement extends LitElement {
  static properties = {
    searching: { type: Boolean },
    result: { type: Array },
    example: { type: String },
    fontSize: { type: Number },
    selectedPart: { type: HTMLElement }
  }

  partIndex = -1

  constructor () {
    super()
    this.searching = false
    this.result = []
    this.fontSize = localStorage.getItem('insta-widget:tatoeba-fontsize') ? JSON.parse(localStorage.getItem('insta-widget:tatoeba-fontsize')) : 34;
    this.selectedPart = null
    this.loadLocalStorage()

    this.addEventListener('click', e=>{
      const target =e.composedPath()[0];
      if (target.nodeName == 'SPAN' && target.classList.contains('text')) {
        return
      }
      this.selectableParts.forEach(el=>el.removeAttribute('selected'))
    })
  }

  get dialog () { return this.shadowRoot.querySelector('mwc-dialog') }
  get textfield () { return this.shadowRoot.querySelector('mwc-textfield') }
  get textarea () { return this.shadowRoot.querySelector('mwc-textarea') }
  get selectableParts () { return this.shadowRoot.querySelectorAll('.part') }

  static styles = [globalStyles, css`
    canvas-element {
      background-color: white;
    }
    page-element {
      padding: 24px;
    }
    .item {
      padding:12px 8px;cursor:pointer
    }
    .item:hover {
      background-color: #eee;
    }
    #sentence {
      display: flex;
      flex-wrap: wrap;
    }
    .part {
      position: relative;
      /* padding-bottom: 5px; */
      cursor: pointer;
      margin: 0 2px;
    }
    .part > .underline {
      background-color: black;
      position:absolute;left:0;right:0;bottom:0;
      height: 3px;
      margin:0 5px;
    }
    .part[selected], .part > span::selection {
      background-color: yellow;
      color: black !important;
    }
    mwc-textarea {
      width: 100%;
    }
    w-sep {
      margin-bottom: 15px !important;
    }
    #colors > div {
      width:42px;
      height: 42px;
      border-radius: 50%;
      margin: 0 3px;
      cursor: pointer;
    }
  `]

  render () {
    return html`
    <canvas-element>
      <page-element active flex column style="align-items: flex-start;font-size:${this.fontSize}px;">
        <div id=sentence>
        ${this.example.j.split('.').map(part => {
          return html`
          <div class=part jp style="font-size:1.1em;font-weight:500" @click=${(e)=>{this.selectedPart = e.target.parentElement}}>
            <span class="text" style="user-select:all">${part}</span>
            ${part !== '。' ? html`<div class="underline"></div>` : ''}
          </div>`
        })}
        </div>
        <w-sep></w-sep>
        <div id=english>${this.example.e}</div>
      </page-element>
      <div style="position: absolute; bottom:0; right: 0;font-size:24px;color:#9e9e9e;">@chikojap</div>
    </canvas-element>

    <div flex style="justify-content: flex-start">
      <mwc-icon-button icon=settings @click=${()=>{this.showExamplesDialog()}}></mwc-icon-button>
      <mwc-icon-button icon=content_copy @click=${()=>{this.copyWordsList()}}></mwc-icon-button>
      <mwc-icon-button icon=arrow_backward @click=${(e)=>{e.stopPropagation();this.selectPreviousPart()}}></mwc-icon-button>
      <mwc-icon-button icon=arrow_forward @click=${(e)=>{e.stopPropagation();this.selectNextPart()}}></mwc-icon-button>
      <mwc-slider
        min=7
        max=100
        step=1
        value=${this.fontSize}
        @input=${(e)=> {this.fontSize=e.detail.value;
          localStorage.setItem('insta-widget:tatoeba-fontsize', this.fontSize)
        }}
        style="flex:1"
      ></mwc-slider>
    </div>
    <div id=colors flex style="justify-content:flex-start"
        @click=${(e)=>{this.onColorClick(e)}}>
      <div style="background-color:#f44336"></div>
      <div style="background-color:#4caf50"></div>
      <div style="background-color:#3f51b5"></div>
      <div style="background-color:#ffc107"></div>
      <div style="background-color:#795548"></div>
      <div style="background-color:#9e9e9e"></div>
      <div style="background-color:#212121"></div>
      <div style="background-color:#009688"></div>
      <div style="background-color:#9c27b0"></div>
    </div>
    <div style="padding:12px;font-size:1.5em;background-color:white;">${this.example.j.replace(/\./g, '')}</div>
    <mwc-textarea rows=3
      .value=${this.example.j}
      @keyup=${(e) => {
        this.example.j = this.textarea.value;
        this.requestUpdate()
        this.saveLocalStorage()
      }}
    ></mwc-textarea>

    <mwc-dialog heading="Fetch examples">
      <div flex>
        <mwc-textfield outlined></mwc-textfield>
        <mwc-icon-button icon=search @click=${()=>{this.onSearchClick()}}></mwc-icon-button>
      </div>
      <div id=result>
        ${this.searching
          ? html`fetching...`
          : this.result.map(item => {
            return html`
            <div class=item
                  @click=${()=>{this.chooseExample(item)}}>
              <div>${item.j}</div>
              <div>${item.e}</div>
            </div>
            `
          })}
      </div>
      <mwc-button outlined slot="secondaryAction" dialogAction="close">close</mwc-button>
      <!-- <mwc-button unelevated slot="primaryAction" @click=${()=>{this.onSubmitClick()}}>submit</mwc-button> -->
    </mwc-dialog>
    `
  }

  copyWordsList () {
    let list = 'Click here for information\n'
    if (this.example) {
      for (const word of this.example.j.split('.')) {
        if (['。', '、'].includes(word)) { continue }
        list += '\n'
        list += word
        const item = {
          word
        }
        // list.push(item)
        const search = getExactSearch(word, false)
        if (search && search[4]) {
          list += ` (${search[4]} [${toRawRomaji(search[4])}])`
          // item.hiragana = search[4]
          // item.roman = toRawRomaji(item.hiragana)
        }
        else if (word == 'は') {
          list += ' [wa]'
        }
        else {
          list += ` [${toRawRomaji(word)}]`
        }

        if (word == 'は') { list += ' : Topic particle' }
        else if (word == 'に') { list += ' : "in" particle' }
        else if (word == 'が') { list += ' : Subject particle' }
        else if (search && search[3]) {
          list += ` : ${search[3]}`
        }
        else {
          list += ' : '
        }
      }
    }
    copyToClipboard(`${list}

${instaHashTags}
`)
  }

  selectPreviousPart () {
    this.partIndex--;
    this.selectableParts.forEach(el => el.removeAttribute('selected'));
    const part = this.selectableParts[this.partIndex];
    if (part) {
      part.setAttribute('selected', '')
      speakJapanese(part.textContent)
    }
  }
  selectNextPart () {
    this.partIndex++;
    this.selectableParts.forEach(el => el.removeAttribute('selected'));
    const part = this.selectableParts[this.partIndex];
    if (part) {
      part.setAttribute('selected', '')
      speakJapanese(part.textContent)
    }
  }


  onColorClick (e) {
    if (this.selectedPart) {
      const color = e.target.style.backgroundColor;
      this.selectedPart.style.color = color;
      this.selectedPart.querySelector('.underline').style.backgroundColor = color;
    }
  }

  async onSearchClick() {
    if (this.searching || this.textfield.value == '') return;
    this.searching = true;
    const search = this.textfield.value;

    try {
      const response = await fetch(`https://assiets.vdegenne.com/japanese/tatoeba/${encodeURIComponent(search)}`)
      const load = await response.json()
      this.result = load
    } catch (e) {

    } finally {
      this.searching = false;
    }
  }

  chooseExample (example) {
    this.example = example
    this.dialog.close()
    this.saveLocalStorage()
  }

  loadLocalStorage () {
    let example = localStorage.getItem('insta-widget:tatoeba')
    if (example) {
      this.example = JSON.parse(example)
    }
    else {
      this.example = { e: '', j: '' }
    }
  }
  saveLocalStorage () {
    localStorage.setItem('insta-widget:tatoeba', JSON.stringify(this.example))
  }

  showExamplesDialog () { this.dialog.show() }
}

window.customElements.define('post-element', PostElement)