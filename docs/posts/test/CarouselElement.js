import { html, globalStyles } from '../../app.js'
import {ElementsManager} from './elements-manager.js'
import {PostElementBase} from '../../PostElementBase.js'

export class CarouselElement extends PostElementBase {
  elementsManager = new ElementsManager()

  constructor () {
    super()
    this.elementsManager.addEventListener('submit', () => { this.requestUpdate() })
  }

  template () {
    return html`${this.elementsManager}`
  }

  controls () {
    return html`<mwc-icon-button icon=settings @click=${()=>{this.elementsManager.show()}}></mwc-icon-button>`
  }
}