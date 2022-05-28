import { html, LitElement, nothing } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '@material/mwc-dialog'
import '@material/mwc-icon-button'
import { convertPunctuationsToTags, playJapaneseAudio, sleep } from './util';
import { hasJapanese, isFullJapanese } from 'asian-regexps';
import { speakJapanese } from './speech';

@customElement('w-card')
export class WidgetCard extends LitElement {
  render() {
    return html`<slot></slot>`
  }

  protected createRenderRoot(): Element | ShadowRoot {
    return this
  }

  async operate () {
    const playableElements = this.querySelectorAll('[play]')
    for (const el of playableElements) {
      const content = el.getAttribute('play') || el.textContent?.trim()
      if (content) {
        el.setAttribute('hl', '')
        await sleep(1000)
        try {
          await playJapaneseAudio(content)
        } catch (e) {
          await speakJapanese(content)
        }
        el.removeAttribute('hl')
        await sleep(1000)
      }
    }
  }
}