import { html, css, sleep, playAudio } from "../app.js";

const elements = [
  { w: '値段', s: 'ね*だん*', m: 'price' },
  { w: '階段', s: 'かい*だん*', m: 'stairs' }
]

export const styles = css`
:host {
  --notice-color: #b2ebf2;
}
canvas-element {
  background-color: #0505d7;
  color: white;
}
page-element {
  top: -24px;
}
`

export const template = html`
<canvas-element>
  <page-element active padding=106 fontsize=36 flex column>
    ${elements.map((el, i) => {
      return html`
      <span class=item>
        <span flex between>
          <w-span t=${el.w} huge .play=${el.s}></w-span>
          <w-span t=${el.m}></w-span>
        </span>
        <w-span t=${el.s} style="font-weight:300"></w-span>
      </span>
      ${i !== elements.length - 1 ? html`
      <w-sep h=71></w-sep>
      ` : null}
      `
    })}
  </page-element>
  <page-element flex>
    <w-span huge .play=${()=>sleep(1000)}>chikojap</w-span>
  </page-element>
</canvas-element>
`