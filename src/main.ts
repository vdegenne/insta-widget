import { html, LitElement } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import '@material/mwc-textarea'
import { TextArea } from '@material/mwc-textarea';

@customElement('app-container')
export class AppContainer extends LitElement {
  @state() text: string = ''

  @query('mwc-textarea') textarea!: TextArea;

  render() {
    return html`
    <mwc-textarea
      @keydown=${e=>this.text = this.textarea.value}></mwc-textarea>
    `
  }
}