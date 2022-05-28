import { LitElement, css, globalStyles, sleep, play } from "../../app.js";
import { highlight, unhighlight } from "../../util.js"
import './feedback-element.js'

export class PostElement extends LitElement {
  items = [
    { w: '済む', s: 'すむ', m: 'to be completed' },
    { w: '進む', s: 'すすむ', m: 'to go forward' },
    { w: '包む', s: 'つつむ', m: 'to wrap up' },
    { w: '蒸す', s: 'むす', m: 'to steam' },
    { w: '娘', s: 'むすめ', m: 'daughter' },
  ]
  positions = [[110, 501], [385, 569], [433, 355], [496, 76], [31, 199]]

  get feedbackElement () {
    return this.shadowRoot.querySelector('feedback-element')
  }

  /**
   * Styles
   */
  static styles = [globalStyles, css`
    canvas-element {
      background-size: 100%;
      font-size: 34px;
      --hl-color: #f44336;
    }
    .tag {
      position: absolute;
    }
    *:not([hl]) > [notice] {
      /* background: #0000001f;
      color: black !important; */
    }
    feedback-element {
      color: grey;
    }
  `]

  /**
   * Render
   */
  render() {
    return html`
    <canvas-element style="background-image:url(${cwd()}/map.png)">
      <feedback-element style="font-size:0.8em"></feedback-element>
      ${this.items.map((item, i)=>{
        return html`
        <!-- <div class="tag" style="position: absolute;left:${this.positions[i][0]}px;top:${this.positions[i][1]}px"> -->
          <w-span t=${item.w} class=tag style="left:${this.positions[i][0]}px;top:${this.positions[i][1]}px;" .item=${item} fs=1.3em fw=500></w-span>
        <!-- </div> -->
        `
      })}
    </canvas-element>
    <mwc-button unelevated @click=${()=>{this.getPositionValues()}}>get positions</mwc-button>
    `
  }

  async operate () {
    ;(new Audio(`${cwd()}/speech.mp3`)).play();
    const tags = this.shadowRoot.querySelectorAll('.tag')
    for (const tag of tags) {
      const item = tag.item
      highlight(tag)
      this.feedbackElement.feedback = item.m
      this.feedbackElement.subfeedback = item.s
      // await play(item.s, 0, 0).call(tag)
      await sleep(1900)
      unhighlight(tag)
    }

    this.feedbackElement.clear()
  }

  getPositionValues() {
    console.log(JSON.stringify(
      [...this.shadowRoot.querySelectorAll('.tag')].map(el=>[parseInt(el.style.left), parseInt(el.style.top)])
    ))
  }
}


window.customElements.define('post-element', PostElement);

export function cwd () {
  const url = new URL(import.meta.url)
  return `${url.origin}${url.pathname.split('/').slice(0, -1).join('/')}`
}