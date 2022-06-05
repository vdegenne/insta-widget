import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@material/mwc-dialog'
import '@material/mwc-icon-button'
import { sleep } from './util';

@customElement('page-element')
export class PageElement extends LitElement {

  @property({type: Boolean}) active = false;
  @property({type:Number}) pad = 12;
  @property({type:Number}) fs = 28;
  // @property({type:Number}) pms = 1000; // pause ms
  @property({type:Array}) pause = [0, .5, 1, 0]

  render() {
    return html`<style>
      :host {
        padding: ${this.pad}px;
        box-sizing: border-box;
        font-size: ${this.fs}px;

        position: absolute; top: 0; left: 0; right: 0; bottom: 0;

        opacity: 0;
        /* transition: opacity .7s linear; */

        /* top: -24px; */
      }
      :host([active]) {
        opacity: 1;
      }
    </style><slot></slot>`
  }

  async operate() {
    await sleep(this.pause[0] * 1000)
    this.setAttribute('active', '')
    await sleep(this.pause[1] * 1000)
    const slot = this.shadowRoot!.querySelector('slot')!.assignedElements()
    const operable: any = slot.map(el=>[el, ...el.querySelectorAll('*')]).flat()
      .filter(el => {
        return ('operate' in el || 'play' in el || 'op' in el)
      })
    for (const el of operable) {
      if ('operate' in el) {
        // @ts-ignore
        await el.operate()
      }
      else if ('play' in el) {
        await el.play()
      }
      else if ('op' in el) {
        await el.op()
      }
      else {
        // switch (typeof o.play) {
        //   case 'string':
        //     o.setAttribute('hl', '')
        //     await sleep(this.pms)
        //     await playAudio(o.play)
        //     o.removeAttribute('hl')
        //     await sleep(this.pms)
        //     break;
        //   case 'function':
        //     await o.play(o)
        //     break;
        // }
      }
    }
    await sleep(this.pause[2] * 1000)
    this.removeAttribute('active')
    await sleep(this.pause[3] * 1000)
  }
}