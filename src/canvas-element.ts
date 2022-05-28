import { css, html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@material/mwc-dialog'
import '@material/mwc-icon-button'
import { globalStyles } from './styles/globalStyles'

@customElement('canvas-element')
export class CanvasElement extends LitElement {

  static styles = css`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 640px;
    height: 640px;
    background-color: #ffedb7;
    position: relative;
    box-sizing: border-box;
  }
  `

  render() {
    return html`<slot></slot>`
  }

  async operate () {
    const slot = (this.shadowRoot!.querySelector('slot')!).assignedElements()
    for (const el of slot) {
      if ('operate' in el) {
        // @ts-ignore
        await el.operate()
      }
    }
  }
}