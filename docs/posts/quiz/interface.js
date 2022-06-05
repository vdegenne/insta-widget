import { html, LitElement, css, globalStyles }from '../../app.js'
import {googleImageSearch} from '../../util.js'
// import {PostElementBase} from '../../PostElementBase'

const alphabet = 'abcdefghijklmnopqrstuvwxyz'

export class PostElement extends LitElement {
  static properties = {
    params: { type: Object }
  }

  constructor () {
    super()
    this.loadParams()
  }

  static styles = [globalStyles, css`
  canvas-element {
    background-color: #fff;
  }
  page-element {
    padding-top: 0;
  }
  #controls {
    margin-top: 4px;
  }
    #choices {
      display: flex;
      justify-content: space-around;
      width: 100%;
      padding: 0 50px;
      box-sizing: border-box;
    }
    .choice {
      display: flex;
      align-items: center;
    }
    .choice > div:first-of-type {
      --choice-letter-size: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--choice-letter-size);
      height: var(--choice-letter-size);
      background-color: #283593;
      color: white;
      border-radius: 5px;
      /* font-weight: 500; */
    }
    .choice > w-span {
      font-size: 4em;
      font-weight: 500;
      position: relative;
      top: -7px;
      margin: 0 50px 0 12px;
    }
    .choice:last-of-type > w-span {
      margin-right: 0;
    }
  `]

  render() {
    const choices = this.params.choices.split('/')
    const answer = choices.find((c, i)=>{
      if (c[0] == '$') {
        choices[i] = c.substring(1)
        return true
      }
      return false
    }).slice(1)
    console.log(choices, answer)
    return html`
    <canvas-element>
      <page-element active flex column>
        <div style="font-size:3.5em;margin:8px 0;font-weight: 500;"><span style="color:#b71c1c">Kanji</span> Quiz</div>
        ${this.params.img ? html`
        <div style="height:1px;flex:1;display:flex;justify-content:center;align-items:center">
          <img src="${this.params.img}" style="height:100%;border-radius:22px">
          <div style="position:absolute;font-size:6em;color:white">?</div>
        </div>
        ` : ''}
        <div id=choices>
        ${choices.map((c, i) => html`
          <div class=choice>
            <div>${alphabet[i].toUpperCase()}</div>
            <w-span t=${c}></w-span>
          </div>
        `)}
        </div>
      </page-element>
    </canvas-element>
    <div id="controls">
      <mwc-icon-button icon=settings
        @click=${()=>{this.changeParams()}}></mwc-icon-button>
      <mwc-icon-button icon=image
        @click=${()=>{if (answer) { googleImageSearch(answer) }}}></mwc-icon-button>
    </div>
    `
  }

  changeParams () {
    const choices = prompt('choices', this.params.choices)
    if (choices) {
      this.params.choices = choices
    }
    const img = prompt('img')
    if (img) {
      this.params.img = img
    }
    this.requestUpdate()
    this.saveParams()
  }

  saveParams () {
    localStorage.setItem('insta-widget:quiz-params', JSON.stringify(this.params))
  }

  loadParams () {
    let params = localStorage.getItem('insta-widget:quiz-params')
    if (params) {
      this.params = JSON.parse(params)
    }
    else {
      this.params = { choices: '', img: '' }
    }
  }
}


window.customElements.define('post-element', PostElement)