import { css, html, playJapanese } from '../../app.js'
import { CarouselElement } from './CarouselElement.js'
import { generateOutlineStyle } from '../../util.js'

export class PostElement extends CarouselElement {

  static styles = [super.styles, css`
  canvas-element {
    font-size: 74px;
    background-color: white;
  }
  page-element {
    padding: 0;
  }
  `]

  template() {
    return html`
    <style>
      .card > w-span {
        position: absolute;
        text-shadow: ${generateOutlineStyle('white', 3)};
        font-weight: 500;
        /* font-size: 1.8em; */
      }
    </style>
    <canvas-element>
      <page-element active flex style="flex-wrap:wrap">
        ${this.elementsManager.elements.map((el, i) => {
          return html`
          <img src="${el.i}" width=50% style="max-width: 210px">
          `
        })}
      </page-element>
      ${this.elementsManager.elements.map((el, i) => {
        return html`
        <page-element flex class=card>
          <img src="${el.i}" @load=${(e)=>{this.resizeImage(e.target)}}/>
          <w-span t=${el.w} style="top:26px;left:12px;" fs=2em></w-span>
          <w-span t=${el.s} style="top:26px;right:12px;" fs=1.2em></w-span>
          <w-span t=${el.m} style="bottom:18px" fs=1.8em></w-span>
        </page-element>
        `
      })}
      <page-element flex column fs=50>
        <w-span t="Click the ❤️ icon"></w-span>
        <w-span t="to support free content"></w-span>
      </page-element>
      <span style="position:absolute;bottom:0;right:0;right:0;font-size:16px;">@chikojap</span>
    </canvas-element>
    ${super.template()}
    `
  }

  controls () {
    return html`<div style="min-width:200px;display:flex;align-items:center;margin-top:5px">${super.controls()}
    <mwc-button id=audioButton @click=${(e)=>{playJapanese(e.target.textContent)}}>${this.elementsManager.elements[this.activePage - 1]?.s}</mwc-button>
    </div>`
  }

  firstUpdated() {
    super.firstUpdated()
    window.addEventListener('keydown', (e)=>{
      if (e.code == 'KeyS') {
        this.shadowRoot.querySelector('#audioButton').click()
      }
    })
  }

  // async updated () {
  //   setTimeout(() => {
  //     const images = [...this.shadowRoot.querySelectorAll('img')]
  //     for (const img of images) {
  //       console.log(img.width)
  //     }
  //   }, 1000)
  // }
  resizeImage (imgEl) {
    if (imgEl.width > imgEl.height) {
      imgEl.setAttribute('width', '100%')
    }
    else {
      imgEl.setAttribute('height', '100%')
    }
  }
}


window.customElements.define('post-element', PostElement);