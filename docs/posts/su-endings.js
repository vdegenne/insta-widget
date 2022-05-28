import { html, css, playJapaneseAudio, speakJapanese } from "../app.js";
import { highlight, removePunctuationsFromString, sleep, unhighlight } from "../util.js";

const elements = [
  { w: '出す', s: 'だす', m: 'to take out' },
  { w: '押す', s: 'おす', m: 'to push' },
  { w: '渡す', s: 'わたす', m: 'to get across' },
  { w: '返す', s: 'かえす', m: 'to put back' },
  { w: '話す', s: 'はなす', m: 'to say something' },
  { w: '消す', s: 'けす', m: 'to erase' },
  { w: '貸す', s: 'かす', m: 'to rent out' },
  { w: '擦る', s: 'する', m: 'to rub' },
  { w: '差す', s: 'さす', m: 'to put up' },
  { w: '無くす', s: 'なくす', m: 'to remove' },
]
const line = elements.map(e=>e.s).join('')

const playAudio = function (text) {
  text = removePunctuationsFromString(text)
  return async function () {
    highlight(this)
    await sleep(0)
    try {
      await playJapaneseAudio(text)
    } catch (e) {
      await speakJapanese(text, 1)
    }
    await sleep(2000)
    unhighlight(this)
  }
}

export const styles = css`
canvas-element {
  background-color: black;
  color: white;
}
:host {
  --notice-color: grey;
  --hl-color: white;
}
page-element {
  top: -24px;
}
[underline] {
  text-decoration: none;
  background-color: white;
  color: black;
  padding: 0 5px;
  border-radius: 3px;
}
w-sep:last-of-type {
  /* margin: 0; */
}
`

export const template = html`
<canvas-element>
  <page-element flex column active padding=42>
    <div .play=${()=>sleep(5000)}>
      <div>In Japanese when a verb ends with <w-span t=す s=48px></w-span></div>
      <span>it usually means the verb is a direct action</span>
      <span>(using your hand, mouth, or another part of your body to make this action.)</span>
      <w-sep h=200></w-sep>
      <div>Here's a non-exhaustive list<br>including few of them from <span underline>JLPT5</span>.</div>
    </div>
  </page-element>
  ${elements.map((el, i) => {
    return html`
    <page-element flex column fontsize=64 pms=700 ?active=${false && i==0}>
        <w-span t=${el.m} style=""></w-span>
        <div flex column>
          <w-span t=${el.w} c=grey huge w=500
            .play=${playAudio(el.s)}></w-span>
          <w-span t=${el.s}></w-span>
        </div>
    </page-element>
    `
  })}
  <!-- <page-element flex padding=42>
    <w-span t=${line} .play=${playAudio(line)} s=52px></w-span>
    <span .play=${()=>sleep(2000)}></span>
  </page-element> -->
    <!-- <div .play=${()=>sleep(999999)}></div> -->
  <div id=stamp style="position:absolute;bottom:0;right:0">@chikojap</div>
</canvas-element>
`