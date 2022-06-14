import { html, LitElement, css, globalStyles, copyToClipboard }from '../../app.js'
import {googleImageSearch, instaHashTags} from '../../util.js'
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
      font-size: 95px;
      font-weight: 500;
      display: flex;
      align-items: center;
      margin: 5px 0;
      /* margin: 18px 0; */
    }
    header > img {
      /* width: 48px; */
      margin: 0 24px 0 12px;
    }
    #center {
      height:1px;flex:1;display:flex;justify-content:center;align-items:center;border-radius:22px;
      margin: 0 18px;
      width: 100%;
    }
    #center > img {
      /* width:100%; */
      height: 100%;
    }
    #choices {
      display: flex;
      justify-content: center;
      width: 100%;
      box-sizing: border-box;
      /* flex: 1; */
      margin: 18px 0;
      margin-top: 0;
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
      font-size: 4.5em;
      font-weight: 100;
      color: #212121;
      position: relative;
      top: -7px;
      /* font-family: "Times New Roman"; */
      /* font-family: cursive; , 'Rampart One'; */
      /* -webkit-text-stroke: thin; */
    }
    .choice:last-of-type > w-span {
      margin-right: 25px;
    }
    #controls {
      margin-top: 4px;
    }

    .outlined {
      text-shadow: 0 0 2px black, 0 0 2px black, 0 0 2px black, 0 0 2px black;
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

    return html`
    <div style="background-color:#b71c1c;height:12px;"></div>
    <canvas-element>
      <page-element active flex column>
        <header>
          <img src="../images/jp_flag2.png">
          <span style="color:#b71c1c;margin-right:12px;">Kanji</span><span>Quiz</span>
        </header>
        ${question ? html`
        <div>What's the Kanji for "<b>${question}</b>" ?</div>
        ` : html`
        <div style="margin-bottom:12px;">How well do you know Japanese?</div>
        `}
        <div id=center>
          ${this.params.img ? html`
            <img src="${this.params.img}" style="border-radius:22px">
            <!-- <div class="outlined" style="position:absolute;font-size:2.5em;color:white;font-weight:300">${question || ''}</div> -->
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

        <div style="position:absolute;bottom:0;right:0;color:#b71c1c;opacity:0.5;font-size:0.9em">@chikojap</div>
      </page-element>
    </canvas-element>
    <div style="background-color:#b71c1c;height:12px;"></div>
    <div id="controls">
      <mwc-icon-button icon=settings
        @click=${()=>{this.changeParams()}}></mwc-icon-button>
      <mwc-icon-button icon=image
        @click=${()=>{if (answer) { googleImageSearch(answer) }}}></mwc-icon-button>
      <mwc-icon-button icon=content_copy
        @click=${()=>{copyToClipboard(instaHashTags)}}></mwc-icon-button>
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