import { html, css, play } from "../app.js";

const elements = [
  { w: '細い', s: 'ほそい', m: 'thin, slender', a: 'hosoi' },
  { w: '遅い', s: 'おそい', m: 'slow, late', a: 'osoi' },
  { w: '忙しい', s: 'いそがしい', m: 'to be busy', a: 'isogashii' },
  { w: '急ぐ', s: 'いそぐ', m: 'to hurry', a: 'isogu' },
]
// const line = elements.map(e=>e.s).join('')



export const styles = css`
canvas-element {
  background-color: var(--logo-color-1);
  background: linear-gradient(333deg, rgba(6,4,215,1) 0%, rgba(2,0,140,1) 100%);
  color: white;

  --notice-color: red;
  --hl-color: orange;
}
w-sep {
  margin: 18px 0;
  border-bottom: 43px solid white;
  opacity: .5;
}
w-span {
  display: inline-block;
  flex: 1;
}
`

export const template = html`
<canvas-element>
  <page-element class="flex column" padding=42 active pause='[0, 0.5, 999, 0]' active>
  ${elements.map(el => {
    return html`
    <div flex fullwidth>
      <w-span t=${el.m} style=""></w-span>
      <w-span t=${el.w} style="text-align:center" big w=500 c=#7371fb
              .op=${play(`2${el.w}.mp3`, 0, 900)}></w-span>
      <w-span t=${el.s} style="text-align:right"></w-span>
    </div>
    <w-sep></w-sep>
    `
  })}
  </page-element>
  <div id=stamp style="position:absolute;bottom:0;right:0">@chikojap</div>
</canvas-element>
`