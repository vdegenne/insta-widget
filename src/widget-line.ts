import { css, html, LitElement, nothing } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '@material/mwc-dialog'
import '@material/mwc-icon-button'
import { convertPunctuationsToTags, playJapaneseAudio, sleep } from './util';
import { hasJapanese, isFullJapanese } from 'asian-regexps';
import { speakJapanese } from './speech';

@customElement('w-line')
export class WidgetLine extends LitElement {
  // line
  @property() t = ''

  @property({type: Number}) pause = 500

  render() {
    const parts = this.t.split('/')
    return html`
    ${parts.map(p=>{
      return html`<span ?jp=${hasJapanese(p)}>${unsafeHTML(convertPunctuationsToTags(p))}</span>`
    })}
    <style>
      w-line {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      w-line > span {
        display: inline-block;
        white-space: pre;
      }
      w-line > span:nth-child(1) {
        /* width: 200px; */
        font-size: 2em;
      }
    </style>
    `
  }

  protected createRenderRoot(): Element | ShadowRoot {
    return this
  }


  async operate() {
    const head = this.querySelector('span:nth-child(1)')!
    head.setAttribute('hl', '')
    await sleep(this.pause)
    try {
      await playJapaneseAudio(head.textContent?.trim())
    } catch (e) {
      await speakJapanese(head.textContent?.trim()!)
    }
    head.removeAttribute('hl')
    await sleep(this.pause)
  }
}