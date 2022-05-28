import { html, LitElement, nothing } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '@material/mwc-dialog'
import '@material/mwc-icon-button'
import { convertPunctuationsToTags } from './util'
import { hasJapanese } from 'asian-regexps';
import { globalStyles } from './styles/globalStyles';

@customElement('w-span')
export class WidgetSpan extends LitElement {
  // text
  @property()
  t = ''
  // color
  @property()
  c = ''
  // fontSize
  @property()
  fs = ''
  // fontWeight
  @property()
  fw = ''
  // width
  @property()
  w = ''

  static styles = [globalStyles]

  render() {
    if (hasJapanese(this.t))
      this.setAttribute('jp', '')
      this.style.color = this.c
      this.style.fontSize = this.fs
      this.style.fontWeight = this.fw
      this.style.width = this.w
    return html`${unsafeHTML(convertPunctuationsToTags(this.t))}`
  }

  updated () {
    // const content = this.textContent
    // this.shadowRoot?.innerHTML = convertPunctuationsToTags(this.textContent!)
  }

  protected createRenderRoot(): Element | ShadowRoot {
    return this
  }
}