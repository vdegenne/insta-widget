import { html, css, sleep, playAudio } from "../app.js";

const elements = [
  { w: '１日', s: 'ついたち', m: 'first day' },
  { w: '２日', s: 'ふつか', m: 'second day' },
  { w: '３日', s: 'みっか', m: 'third day' },
  { w: '４日', s: 'よっか', m: 'fourth day' },
  { w: '５日', s: 'いつか', m: 'fifth day' },
  { w: '６日', s: 'むいか', m: 'sixth day' },
  { w: '７日', s: 'なのか', m: 'seventh day' },
  { w: '８日', s: 'ようか', m: 'eighth day' },
  { w: '９日', s: 'ここのか', m: 'ninth day' },
  { w: '１０日', s: 'とおか', m: 'tenth day' },
  { w: '２０日', s: 'はつか', m: 'twentieth day' },
]

export const styles = css`
canvas-element {
  background-color: #ffe282;
  color: black;
  box-shadow: #00000042 0px 0px 144px -26px inset;
}
:host {
  --notice-color: #ff9999;
  --hl-color: black;
}
page-element {
  top: -62px;
}
[underline] {
  text-decoration: none;
  background-color: white;
  color: #c62827;
  border-radius: 3px;
}
w-span {
  transition: color .3s linear;
}
[big] {
  font-size: 2.3em;
}
`

export const template = html`
<canvas-element>
  <page-element active flex column center>
    <span big>🎓</span>
    <span big>Numerical Days</span>
    <span big>🗓️</span>
    <span big>in Japanese</span>
    <br>
    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Flag_of_Japan.svg/1200px-Flag_of_Japan.svg.png" width=120>
  </page-element>
  ${elements.map((el, i) => {
    return html`
    <page-element ?active=${false && i==0} flex column fontsize=51 pms=0>
      <w-span t=${el.w}></w-span>
      <w-span t=${el.s} c=#f4da83 style="position:relative;top:-8px;margin:28px 0" big
        .play=${el.s}></w-span>
      <w-span t=${el.m} style=""></w-span>
    </page-element>
    `
  })}
  <span id=stamp style="position:absolute;bottom:0;right:0">@chikojap</span>
</canvas-element>
`