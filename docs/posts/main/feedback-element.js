import { LitElement, html, css, globalStyles} from '../../app.js'

export class FeedbackElement extends LitElement {
  static properties = {
    feedback: {},
    subfeedback: {}
  }

  static styles = [globalStyles, css`
  :host {
    position: absolute;
    /* top: 16px;
    left: 16px; */
  }
  `]

  render() {
    return html`
      <div id=feedback>
        ${this.feedback ? html`<w-span t=${this.feedback}></w-span>` : ''}<br>
        ${this.subfeedback ? html`<w-span t=${this.subfeedback}></w-span>` : ''}
      </div>
    `
  }

  clear () {
    this.feedback = undefined
    this.subfeedback = undefined
  }
}


window.customElements.define('feedback-element', FeedbackElement)