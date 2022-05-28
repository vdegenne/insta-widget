import { html, css, sleep, playAudio } from "../app.js";

const elements = [
  { w: '喫茶店', s: 'きっ*さてん*', m: 'coffee shop' },
  { w: '交差点', s: 'こう*さてん*', m: 'intersection' }
]

export const styles = css`
canvas-element {
  background-color: #c62827;
  color: white;
}
:host {
  --notice-color: #ff9999;
  --hl-color: white;
}
page-element {
  top: -24px;
}
[underline] {
  text-decoration: none;
  background-color: white;
  color: #c62827;
  border-radius: 3px;
}
`

export const template = html`
<canvas-element>
  ${elements.map((el, i) => {
    return html`
    <page-element ?active=${i==0} flex column fontsize=58>
      <w-span t=${el.m}></w-span>
      <w-span t=${el.w} .play=${el.s} huge c=#750229></w-span>
      <w-span t=${el.s}></w-span>
    </page-element>
    `
  })}
  <page-element flex style="text-align:center;line-height:48px">
    <span .play=${()=>sleep(1000)}>I went to a <span underline>coffee shop</span><br>
    at the street <span underline>intersection</span></span>
  </page-element>
</canvas-element>
`