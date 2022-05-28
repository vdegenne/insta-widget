import { css, globalStyles, html, LitElement } from '../../app.js'
import {ElementsManager} from './elements-manager.js'
import {cwd} from './util.js'

export class PostElement extends LitElement {
  elementsManager = new ElementsManager()

  static styles = [globalStyles, css`
  canvas-element {
    font-size: 74px;
    background-color: white;
    /* border: 1px solid black; */
  }
  `]

  render() {
    return html`
    <canvas-element>
      ${this.elementsManager.elements.map((el, i) => {
        return html`
        <page-element flex ?active=${i == 0}>
          <!-- <w-span t=${el.w} fw=500></w-span> -->
          <img src="${el.i}" width=100% />
        </page-element>
        `
      })}
    </canvas-element>

    <mwc-icon-button icon=settings @click=${()=>{this.elementsManager.show()}}></mwc-icon-button>

    ${this.elementsManager}
    `
  }

  operate () {
    window.nextPage()
  }

  firstUpdated() {
    this.elementsManager.addEventListener('submit', () => { this.requestUpdate() })
  }
}


window.customElements.define('post-element', PostElement);