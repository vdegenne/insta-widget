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
    border: 12px solid #b71c1c;
    align-items: stretch;
  }
    header {
      width: 100%;
      font-size:3.5em;font-weight: 500;
      display: flex;
      align-items: center;
      margin: 18px 0;
    }
    header > img {
      margin: 0 24px 0 12px;
    }
    #center {
      height:1px;flex:1;display:flex;justify-content:center;align-items:center;background-color:black;border-radius:22px;
      overflow: hidden;
      margin: 0 18px;
    }
    #center > img {
      width:100%;
    }
    #choices {
      display: flex;
      justify-content: center;
      width: 100%;
      box-sizing: border-box;
      /* flex: 1; */
      margin: 18px 0;
    }
    .choice {
      display: flex;
      align-items: center;
      margin: 0 12px;
    }
    .choice > div:first-of-type {
      --choice-letter-size: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--choice-letter-size);
      height: var(--choice-letter-size);
      background-color: #ffc107;
      color: #212121;
      border-radius: 5px;
      margin-right: 12px;
      font-weight: 600;
      /* font-weight: 500; */
    }
    .choice > w-span {
      font-size: 3em;
      font-weight: 500;
      color: #212121;
      position: relative;
      top: -7px;
      font-family: cursive; /* , 'Rampart One'; */
      -webkit-text-stroke: thin;
    }
    .choice:last-of-type > w-span {
      margin-right: 0;
    }
    #controls {
      margin-top: 4px;
    }
  `]

  render() {
    const choices = this.params.choices.split('/')
    let answer, question
    let answerIndex = choices.findIndex(c=>c.startsWith('$'))
    if (answerIndex >= 0) {
      answer = choices[answerIndex].slice(1)
      choices[answerIndex] = answer
    }
    let questionIndex = choices.findIndex(c=>c.startsWith('?'))
    if (questionIndex >= 0) {
      question = choices.splice(questionIndex, 1)[0].slice(1)
      // choices[questionIndex] = question
    }
    console.log(choices, answer, question)
    return html`
    <canvas-element>
      <page-element active flex column>
        <header><img src="./images/jp_flag2.png"><span style="color:#b71c1c;margin-right:12px;">Kanji</span><span>Quiz</span></header>
        <div id=center>
          ${this.params.img ? html`
            <img src="${this.params.img}" style="border-radius:22px">
            <div style="position:absolute;font-size:3em;color:white;-webkit-text-stroke:thin black;">${question || ''}?</div>
          ` : ''}
        </div>
        <div id=choices>
        ${choices.map((c, i) => html`
          <div class=choice>
            <div>${alphabet[i].toUpperCase()}</div>
            <w-span t=${c}></w-span>
          </div>
        `)}
        </div>

        <div style="position:absolute;bottom:0;right:0;color:#b71c1c;opacity:0.5">@chikojap</div>
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