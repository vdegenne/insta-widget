import { css, html, playJapanese } from '../../app.js'
import { CarouselElement } from './CarouselElement.js'
import { generateOutlineStyle } from '../../util.js'
import Kuroshiro from '../../node_modules/kuroshiro/src/index.js'

export class PostElement extends CarouselElement {

  static styles = [super.styles, css`
  canvas-element {
    font-size: 74px;
    background-color: white;
    /* border: inset 10px black; */
  }
  page-element {
    padding: 0;
  }
  header {
    position:absolute;top:0;box-sizing:border-box;align-items:flex-start;
  }
  jlpt-tag {
    border-right: 4px solid #000;
    border-bottom: 4px solid #000;
    margin-right: 18px;
  }
  `]

  template() {
    return html`
    <style>
      w-span {
        text-shadow: ${generateOutlineStyle('white', 3)};
      }
      .card > w-span {
        position: absolute;
        font-weight: 500;
        /* font-size: 1.8em; */
      }
    </style>
    <canvas-element>
      <!-- <div id=frame style="position: absolute;top:0;left:0;right:0;bottom:0;border:inset 10px black;z-index:10;"></div> -->
      <page-element flex style="flex-wrap:wrap;justify-content:space-between">
        ${this.elementsManager.elements.map((el, i) => {
          return html`
          <img src="${el.i}" width=50% style="max-width: 210px">
          `
        })}
      </page-element>
      ${this.elementsManager.elements.map((el, i) => {
        return html`
        <page-element flex class=card ?active=${i==0} style="">
          <div flex style="position:relative;width:100%;">
            <img src="${el.i}" @load=${(e)=>{this.resizeImage(e.target)}} style="display:block"/>
            <span style="position:absolute;bottom:0;left:0;font-size:16px;color:grey">@chikojap</span>
          </div>
          <header flex fullwidth style="align-items:flex-start;justify-content:flex-start">
            <jlpt-tag n=${el.j}></jlpt-tag>
            <div flex between fullwidth style="padding-right: 24px;">
              <w-span t=${el.w} fs=3em style="margin-right:24px"></w-span>
              <div flex column>
                <w-span t=${el.s} fs=1.4em c=grey></w-span>
                <w-span t="[${Kuroshiro.Util.toRawRomaji(el.s)}]" fs=1.2em c=grey></w-span>
              </div>
            </div>
          </header>
          <w-span t=${el.m} style="bottom:19px" fs=1.8em></w-span>
        </page-element>
        `
      })}
      <page-element flex column fs=50>
        <w-span t="Click the ❤️ icon"></w-span>
        <w-span t="to support free content"></w-span>
      </page-element>
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