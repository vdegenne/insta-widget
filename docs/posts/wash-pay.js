import { html, css, playJapaneseAudio, speakJapanese } from "../app.js";
import { highlight, removePunctuationsFromString, sleep, unhighlight } from "../util.js";

const elements = [
  { w: '洗う', s: '_あ_らう', m: 'wash' },
  { w: '払う', s: '_は_らう', m: 'pay' },
]

const playAudio = function (text, pauseMs = 1000) {
  text = removePunctuationsFromString(text)
  return async function () {
    highlight(this)
    await sleep(pauseMs)
    try {
      throw new Error
      await playJapaneseAudio(text)
    } catch (e) {
      await speakJapanese(text, 1, .5)
    }
    unhighlight(this)
    await sleep(pauseMs)
  }
}

export const styles = css`
canvas-element {
  background-color: black;
  color: white;
}
:host {
  --notice-color: grey;
  --hl-color: #f4da83;
}
page-element {
  top: -24px;
}
[underline] {
  text-decoration: none;
  background-color: #ffffff54;
  /* color: #c62827; */
  border-radius: 3px;
}
w-sep:last-of-type {
  margin: 0;
}
`

export const template = html`
<canvas-element>
  <page-element flex column padding=120 fontsize=42 pms=0 active>
  ${elements.map((el, i) => {
    return html`
    <span class=item flex between fullwidth>
      <w-span t=${el.m} style=""></w-span>
      <span flex column>
        <w-span t=${el.w} c=grey big w=500 s=92px
          .play=${playAudio(el.s, 1000)}></w-span>
        <w-span t=${el.s}></w-span>
      </span>
    </span>
    <w-sep h=100></w-sep>
    `
  })}
    <!-- <div .play=${()=>sleep(999999)}></div> -->
  </page-element>
  <page-element flex>
    <span .play=${()=>sleep(2000)}>
      <w-span t="mnemo:" style="opacity:.4"></w-span><br>
      <w-span t="I always _pay_ to _wash_ my debts"></w-span>
    </span>
  </page-element>
  <span id=stamp style="position:absolute;bottom:0;right:0">@chikojap</span>
</canvas-element>
`