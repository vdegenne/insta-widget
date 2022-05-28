import { css, html } from '../../app.js'
import { CarouselElement } from './CarouselElement.js'

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
        <page-element flex ?active=${i == 0}>
          <img src="${el.i}" width=100% />
        </page-element>
        `
      })}
    </canvas-element>
    ${super.template()}
    `
  }
}


window.customElements.define('post-element', PostElement);