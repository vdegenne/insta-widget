import { html, LitElement, css, globalStyles, copyToClipboard, saveFrame, styleMap } from '../../app.js'
import {googleImageSearch, instaHashTags} from '../../util.js'
// import {PostElementBase} from '../../PostElementBase'

const alphabet = 'abcdefghijklmnopqrstuvwxyz'

export class PostElement extends LitElement {
  static properties = {
    params: { type: Object },
    fontSize: { type: Number },
    imageIndex: { type: Number }
  }

  images = [];
  // imageIndex = 0;

  get canvasElement () { return this.shadowRoot.querySelector('canvas-element')}


  constructor () {
    super()
    this.loadParams()
    this.fontSize = 19
    this.imageIndex = 0;
    this.getImages()
  }

  static styles = [globalStyles, css`
  [hide] {
    display: none;
  }
  canvas-element {
    background-color: #fff;
  }
  page-element {
    /* padding-top: 0; */
    border: 12px solid #b71c1c;
    align-items: stretch;
    font-size: initial;
  }
    header {
      width: 100%;
      /* font-size: 95px; */
      font-weight: 500;
      display: flex;
      align-items: center;
      margin: 5px 0;
      margin-top: 0;
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
    }
    .choice {
      display: flex;
      align-items: center;
      margin: 0 12px;
    }
    .choice > div:first-of-type {
      /* --choice-letter-size: 42px; */
      display: flex;
      align-items: center;
      justify-content: center;
      /* width: var(--choice-letter-size);
      height: var(--choice-letter-size); */
      background-color: #ffc107;
      color: #212121;
      border-radius: 5px;
      margin-right: 12px;
      font-weight: 600;
      /* font-weight: 500; */
    }
    .choice > w-span {
      /* font-size: 4.5em; */
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

  get meta () {
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
    return { choices, answer, question }
  }

  render() {

    const { choices, answer, question } = this.meta

    return html`
    <canvas-element>
      <page-element active flex column style="${styleMap({ fontSize: `${this.fontSize}px` })}">
        <header style="font-size:2.3em">
          <img src="../images/jp_flag2.png" width="${this.fontSize * 3}">
          <span style="color:#b71c1c;margin-right:12px">Kanji</span><span>Quiz</span>
        </header>
        ${question ? html`
        <div style="font-size:0.8em;margin-bottom:${this.fontSize/2}px">What's the Kanji for "<b>${question}</b>" ?</div>
        ` : html`
        <div style="margin-bottom:12px;">How well do you know Japanese?</div>
        `}
        <div id=center>
          ${this.images ? this.images.map((img, i) => {
            return html`<img src="${img.data}" ?hide=${i !== this.imageIndex}>`
          }) : nothing}
        </div>
        <div id=choices>
        ${choices.map((c, i) => html`
          <div class=choice style="">
            <div style="font-size:0.7em;width:${this.fontSize}px;height:${this.fontSize}px">${alphabet[i].toUpperCase()}</div>
            <w-span t=${c} fs=3em></w-span>
          </div>
        `)}
        </div>

        <div style="position:absolute;bottom:0;right:0;color:#b71c1c;opacity:0.5;font-size:0.6em">@chikojap</div>
      </page-element>
    </canvas-element>

    <div id="controls">
      <mwc-icon-button icon=settings
        @click=${()=>{this.changeParams()}}></mwc-icon-button>
      <mwc-icon-button icon=image
        @click=${()=>{if (answer) { googleImageSearch(answer) }}}></mwc-icon-button>
      <mwc-icon-button icon=content_copy
        @click=${()=>{copyToClipboard(instaHashTags)}}></mwc-icon-button>
      <mwc-icon-button icon=arrow_backward
        @click=${()=>{this.imageIndex--}}></mwc-icon-button>
      <mwc-icon-button icon=arrow_forward
        @click=${()=>{this.imageIndex++}}></mwc-icon-button>
      <mwc-slider
        discrete
        withTickMarks
        min="1"
        max="100"
        step="1"
        value="19"
        @input=${e=>{this.fontSize=e.detail.value}}
      ></mwc-slider>
      <mwc-icon-button icon=save
        @click=${()=>{saveFrame(this.canvasElement)}}></mwc-icon-button>
    </div>
    `
  }

  async changeParams () {
    const choices = prompt('choices', this.params.choices)
    if (choices && choices != this.params.choices) {
      this.params.choices = choices
      this.getImages()
    }
    // const img = prompt('img')
    // if (img && img != this.params.img) {
    //   this.params.img = img;
    //   this.loadImage()
    // }
    this.requestUpdate()
    this.saveParams()
  }

  async getImages () {
    const { answer } = this.meta
    if (answer) {
      const response = await fetch(`https://assiets.vdegenne.com/google/images/${answer}?????????????lang=jp`)
      this.images = await response.json()
      this.imageIndex = 0;
      this.requestUpdate()
    }
  }

  async loadImage () {
    if (this.params.img) {
      const image = new Image()
      // image.setAttribute('crossorigin', 'anonymous')
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight
        canvas.getContext('2d').drawImage(image, 0, 0);
        this.canvas = canvas
        this.requestUpdate()
      }
      image.src = this.params.img
    }
    // const response = await fetch(this.params.img, {
    //   mode: 'no-cors'
    // })
    // const blob = await response.blob()
    // let result
    // try {
    //   result = await new Promise((resolve, reject) => {
    //     const reader = new FileReader()
    //     reader.addEventListener('loadend', (event) => {
    //       resolve(reader.result)
    //     })
    //     reader.onerror = (e) => {
    //       console.log(e)
    //       reject()
    //     }
    //     reader.readAsDataURL(blob)
    //   })
    // } catch (e) {
    //   console.log(e)
    // }
    // console.log(result)
    // // this.params.img = img
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
      this.params = { choices: ''  }
    }
  }
}


window.customElements.define('post-element', PostElement)