import { html, css, play } from "../app.js";
import { buildImageLink } from "../util.js";

const elements = [
  { w: '述べる', s: 'のべる', m: 'to state' },
  { w: '上る', s: 'のぼる', m: 'to go up' },
  { w: '起きる', s: 'おきる', m: 'to wake up', extension: 'jpg' },
  { w: '乗る', s: 'のる', m: 'to board in' },
  { w: '降りる', s: 'おりる', m: 'to descend' },
  { w: '降る', s: 'ふる', m: 'to fall (snow, rain, ...)', extension: 'jpg' },
]
// const line = elements.map(e=>e.s).join('')



export const styles = css`
canvas-element {
  background-color: white;
  /* background: linear-gradient(333deg, rgba(6,4,215,1) 0%, rgba(2,0,140,1) 100%); */
  color: black;
  box-shadow: rgb(0 0 0 / 23%) 0px 0px 135px -68px inset;
  /* border: 1px solid black; */

  --notice-color: red;
  --hl-color: orange;
}
/* w-sep {
  margin: 18px 0;
  border-bottom: 43px solid white;
  opacity: .5;
} */
[underline] {
  text-decoration: none;
  background-color: #00000024;
}
`

export const template = html`
<canvas-element>
  <page-element active flex column center fontsize=62 pause="[0, 0, 0.5, 1]">
    <img src="${buildImageLink('jp_flag')}" width=120 />
    <w-sep></w-sep>
    <w-span t="SOME _JLPT N5_"></w-span>
    <w-sep h=10></w-sep>
    <w-span t="UP & DOWN"></w-span>
    <w-sep h=10></w-sep>
    <w-span t="VERBS"></w-span>
    <w-sep></w-sep>
    <div>
      ⬆️⬇️
    </div>
    <w-sep></w-sep>
  </page-element>
  ${elements.map((el, i) => {
    return html`
    <page-element class="flex column between" fontsize="36" padding=42 ?active=${false && i==0} pause="[1, 1, 0.5, 0]">
      <div class="flex between fullwidth" style="align-items: center">
        <w-span t=${el.m} s=1.1em></w-span>
        <div class="flex column">
          <w-span t=${el.w} class="transition" s=2em w=500 .play=${play(el.s, 0, 1000)}></w-span>
          <w-span t=${el.s}></w-span>
        </div>
      </div>
      <!-- <div flex fullwidth> -->
        <!-- <w-span t=${el.m} style=""></w-span>
        <w-span t=${el.w} style="text-align:center" big w=500 c=#7371fb
                .op=${play(`2${el.w}.mp3`, 0, 900)}></w-span>
        <w-span t=${el.s} style="text-align:right"></w-span>
        <img -->
      <!-- </div> -->
      <div>
        <img src="${buildImageLink(el.w, el.extension || 'png')}" height=360 />
      </div>
    </page-element>
    `
  })}
  <div id=stamp style="position:absolute;bottom:0;right:0">@chikojap</div>
</canvas-element>
`