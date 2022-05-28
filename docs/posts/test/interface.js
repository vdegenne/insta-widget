import { css, html } from '../../app.js'
import { CarouselElement } from './CarouselElement.js'
import { generateOutlineStyle } from '../../util.js'

export class PostElement extends CarouselElement {

  static styles = [super.styles, css`
  canvas-element {
    font-size: 74px;
    background-color: white;
  }
  `]

  template() {
    return html`
    <canvas-element>
      ${this.elementsManager.elements.map((el, i) => {
        return html`
        <page-element flex ?active=${i == 0} .element=${el}>
          <img src="${el.i}" width=90% />
          <w-span t=${el.m} c=black fs=1.8em style="position: absolute;bottom: 10px;text-shadow:${generateOutlineStyle('white', 8)}" fw=500></w-span>
        </page-element>
        `
      })}
    </canvas-element>
    ${super.template()}
    `
  }

  controls () {
    return html`<div style="min-width:200px;display:flex;align-items:center;margin-top:5px">${super.controls()}${this.elementsManager.elements[this.activePage].s}</div>`
  }
}


window.customElements.define('post-element', PostElement);