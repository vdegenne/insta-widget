import { css, html, LitElement, PropertyValueMap, render } from 'lit'
import { customElement, property, query, queryAll, state } from 'lit/decorators.js'
import '@material/mwc-dialog'
import '@material/mwc-icon-button'
import { designStyles } from './styles/designStyles';
import { convertTextToDesignStructure, DesignTemplate, playJapaneseAudio, sleep } from './util';
import { globalStyles } from './styles/globalStyles';
import { speakJapanese } from './speech';

@customElement('d-w')
export class DifferenceWidget extends LitElement {
  @property({type:Number})
  pauseMs = 1000;

  // @queryAll('.word') wordElements!: HTMLDivElement[];
  get wordElements () {
    return [...this.querySelectorAll<HTMLDivElement>('.word')]
  }
  // get words () { return [...this.wordElements].map(el=>el.textContent)}

  // static shadowRootOptions: ShadowRootInit = {
  //   ...LitElement.shadowRootOptions, delegatesFocus: 'p'
  // }
  // static styles = [sharedStyles, designStyles, css`
  // d-w > * {
  //   background-color: red;
  // }
  // :host > * {
  //   display: none;
  // }
  // `]
  // `

  createRenderRoot() {
    return this;
  }

  render() {
    const slot = this.querySelector('[slot=raw]')!
    const structure = convertTextToDesignStructure(slot.innerHTML!.trim())
    return html`
    ${DesignTemplate(structure)}
    `
  }

  async operate () {
    const elements = this.wordElements
    for (let el of elements) {
      el.setAttribute('hl', '') // highlight
      let text = el.textContent!.trim()
      await sleep(this.pauseMs)
      try {
        await playJapaneseAudio(text)
      } catch (e) {
        await speakJapanese(text)
      }
      el.removeAttribute('hl')
      await sleep(this.pauseMs)
    }
  }
}