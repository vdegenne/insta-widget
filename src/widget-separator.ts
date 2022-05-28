import { html, LitElement } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import '@material/mwc-dialog'
import '@material/mwc-icon-button'
import { Dialog } from '@material/mwc-dialog';

@customElement('w-sep')
export class WidgetSeparator extends LitElement {
  @property({type: Number}) h = 40;
  @property() c = 'white'

  render() {
    const half = this.h / 2;
    return html`<style>
      :host {
        display: block;
        width: 100%;
        margin: ${half}px 0px;
        /* border-bottom: 1px solid ${this.c}; */
      }
    </style>`
  }

  // protected createRenderRoot(): Element | ShadowRoot {
  //   return this
  // }
}