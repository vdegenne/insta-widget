import {LitElement, html} from '../../app.js'

class PostElement extends LitElement {
  render() {
    return html`
    <constellation-element></constellation-element>
    `
  }
}

window.customElements.define('post-element', PostElement)