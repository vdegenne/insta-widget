import { LitElement, css, globalStyles, sleep, play } from "../../app.js";
import { highlight, unhighlight } from "../../util.js"
import './feedback-element.js'

export class PostElement extends LitElement {
  items = [
    { w: '普_通_', s: 'ふつう', m: 'ordinary' },
    { w: '_通_る', s: 'とおる', m: 'to go by' },
    { w: '交_通_', s: 'こうつう', m: 'traffic' },
    { w: '_通_う', s: 'かよう', m: 'to go back and forth' },
    // { w: '娘', s: 'むすめ', m: 'daughter' },
  ]
  positions = [[517, 47], [49, 164], [80, 563], [188, 330]]

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
      --hl-color: #2196f3;
    }
    [underline] {
      text-decoration: none;
      border-bottom: 1px solid black;
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
      font-size:0.8em;
      /* top:initial;
      left:initial; */
      bottom:20px;
      right:20px;
      text-align: right;
    }
    #jlpt {
      position: absolute;top: 0; left: 0;
      background-color: white;
      font-size:18px;
    }
  `]

  /**
   * Render
   */
  render() {
    return html`
    <canvas-element style="background-image:url(${cwd()}/map.png)">
      <!-- JLPT -->
      <div id=jlpt>
        <div style="background:#ffeb3b;color:black;padding:5px 8px;border-radius: 0 0 10px 0;">jlpt4</div>
      </div>
      <!-- // end part to remove !! -->

      <feedback-element style=""></feedback-element>
      ${this.items.map((item, i)=>{
        return html`
        <!-- <div class="tag" style="position: absolute;left:${this.positions[i][0]}px;top:${this.positions[i][1]}px"> -->
          <w-span t=${item.w} class=tag style="left:${this.positions[i][0]}px;top:${this.positions[i][1 ]}px;" .item=${item} fs=1.3em fw=500></w-span>
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
      await sleep(1700)
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