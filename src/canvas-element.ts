import { css, html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@material/mwc-dialog'
import '@material/mwc-icon-button'

@customElement('canvas-element')
export class CanvasElement extends LitElement {

  static styles = css`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 640px;
    max-height: 640px;
    background-color: #ffedb7;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
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

  firstUpdated () {
    window.addEventListener('resize', () => {
      this.updateSize()
    })
  }

  updated () {
    this.updateSize()
  }

  updateSize () {
    const styles = getComputedStyle(this)
    this.style.height = styles.width
  }
}