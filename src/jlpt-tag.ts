import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('jlpt-tag')
export class JlptTag extends LitElement {
  @property({type:Number}) n = 0;
  @property({type:Boolean}) horizontal = false;

  static styles = css`
  :host([n="5"]) { background-color: green; }
  :host([n="4"]) { background-color: #ffeb3b; color: black; }
  :host([n="3"]) { background-color: #ff9800; }
  :host([n="2"]) { background-color: #f44336; }
  :host([n="1"]) { background-color: green; }

  :host {
    display: inline-flex;
    flex-direction: column;
    padding: 5px 10px;
    /* border-radius: 4px; */
    color: white;
    text-transform: uppercase;
    font-size: 17px;
    font-weight: bold;
  }
  `

  render() {
    return html`<span>j</span><span>l</span><span>p</span><span>t</span><span>${this.n}</span>`
  }
}