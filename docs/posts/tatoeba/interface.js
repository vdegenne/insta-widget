import {LitElement, globalStyles, css } from '../../app.js'

console.clear()

export class PostElement extends LitElement {
  static properties = {
    searching: { type: Boolean },
    result: { type: Array },
    example: { type: String },
    fontSize: { type: Number },
    selectedPart: { type: HTMLElement }
  }

  constructor () {
    super()
    this.searching = false
    this.result = []
    this.fontSize = localStorage.getItem('insta-widget:tatoeba-fontsize') ? JSON.parse(localStorage.getItem('insta-widget:tatoeba-fontsize')) : 34;
    this.selectedPart = null
    this.loadLocalStorage()
  }

  get dialog () { return this.shadowRoot.querySelector('mwc-dialog') }
  get textfield () { return this.shadowRoot.querySelector('mwc-textfield') }
  get textarea () { return this.shadowRoot.querySelector('mwc-textarea') }

  static styles = [globalStyles, css`
    canvas-element {
      background-color: white;
    }
    .item {
      padding:12px 8px;cursor:pointer
    }
    .item:hover {
      background-color: #eee;
    }
    #sentence {
      display: flex;
    }
    .part {
      position: relative;
      padding-bottom: 5px;
      cursor: pointer;
      margin: 0 2px;
    }
    .part > .underline {
      background-color: black;
      position:absolute;left:0;right:0;bottom:0;
      height: 3px;
      margin:0 5px;
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
      /* cursor: pointer; */
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
            <span>${part}</span>
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
      <div id=colors flex
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
    <mwc-textarea rows=3
      .value=${this.example.j}
      @keyup=${(e) => {
        this.example.j = this.textarea.value;
        this.requestUpdate()
        this.saveLocalStorage()
      }}
    ></mwc-textarea>
    <div style="padding:12px;font-size:1.5em">${this.example.j.replace(/\./g, '')}</div>

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