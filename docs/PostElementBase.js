import { LitElement, html, globalStyles } from './app.js'

export class PostElementBase extends LitElement {
  static properties = {
    activePage: { type: Number }
  }

  constructor () {
    super()
    this.activePage = 0
  }

  static styles = globalStyles

  scaffold () {
    return html`
    ${this.template()}
    <div style="display:flex;align-items:center;flex-wrap:wrap">
      ${this.controls()}
      <mwc-icon-button icon=arrow_backward @click=${()=>{this.activePage = window.previousPage()}}></mwc-icon-button>
      <mwc-icon-button icon=arrow_forward @click=${()=>{this.activePage = window.nextPage()}}></mwc-icon-button>
      <mwc-slider
        discrete
        max=300
        style="width:100%;flex:1"
        @input=${(e)=>{this.onSliderInput(e)}}
      ></mwc-slider>
    </div>
    `
  }


  onSliderInput(e) {
    const el = this.shadowRoot.querySelector('canvas-element')
    el.style.marginTop = `${e.detail.value}px`
    localStorage.setItem('insta-widget:canvas-top-margin', e.detail.value)
    // console.log(el)
  }

  firstUpdated () {
    let canvasTopMargin = localStorage.getItem('insta-widget:canvas-top-margin')
    if (canvasTopMargin) {
    }
    else {
      canvasTopMargin = 0
    }
    // const topBarHeight = screen.height - window.innerHeight
    // const topSpacing = (screen.height - (2 * topBarHeight) - 640) / 2
    const canvas = this.shadowRoot.querySelector('canvas-element')
    canvas.style.marginTop = `${canvasTopMargin}px`
    this.shadowRoot.querySelector('mwc-slider').value = canvasTopMargin
  }


  // getActivePageElement() {
  //   console.log(this.shadowRoot.querySelectorAll('page-element'))
  //   ;[...this.shadowRoot.querySelectorAll('page-element')].find(el=>el.hasAttribute('active'))
  // }
}
