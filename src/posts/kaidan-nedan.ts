import { css, html, LitElement } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import '@material/mwc-dialog'
import '@material/mwc-icon-button'
import '../canvas-element'
import '../widget-span'
import { globalStyles } from '../styles/globalStyles'

@customElement('kaidan-nedan')
export class KaidanNedan extends LitElement {

  static styles = [globalStyles]

  render() {
    const elements = [
      { w: '値段', s: 'ね*だん*', m: 'price' },
      { w: '階段', s: 'かい*だん*', m: 'stairs' },
    ]
    return html`
    <canvas-element>
      <page-element flex active column>
      ${elements.map(el=> {
        return html`
        <div class="element">
          <w-span t=${el.w}></w-span>
          <div>
            <w-span t=${el.s}></w-span>
            <w-span t=${el.m}></w-span>
          </div>
        </div>
        `
      })}
      </page-element>
    </canvas-element>
    `
  }
}