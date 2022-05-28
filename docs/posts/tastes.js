import { html, css, play } from "../app.js";
import { buildImageLink } from "../util.js";

export const postId = 128
// export const title = 'test'

const elements = [
  { w: '甘い', s: 'あまい', m: 'sweet', emoji: '🧁' },
  { w: '辛い', s: 'からい', m: 'spicy', emoji: '🌶️' },
  { w: '塩辛い', s: 'しおからい', m: 'salty', emoji: '🧂' },
  { w: '酸っぱい', s: 'すっぱい', m: 'sour', emoji: '🍋' },
]



export const styles = css`
canvas-element {
  background-color: var(--logo-color-2);
  /* background: linear-gradient(333deg, rgba(6,4,215,1) 0%, rgba(2,0,140,1) 100%); */
  color: black;
  box-shadow: rgb(0 0 0 / 23%) 0px 0px 135px -68px inset;
  /* border: 1px solid black; */

  --notice-color: red;
  --hl-color: black;
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
    <w-span t="Some"></w-span>
    <w-sep h=10></w-sep>
    <w-span t="Taste"></w-span>
    <w-sep h=10></w-sep>
    <w-span t="Adjectives"></w-span>
    <w-sep></w-sep>
    <w-span t="👅🍋🌶️🧂👅"></w-span>
    <w-sep></w-sep>
  </page-element>
  <page-element class="flex column between" fontsize="36" style="padding: 60px" pause="[0, 2, 1000, 0]">
  ${elements.map((el, i) => {
    return html`
      <div class="flex between fullwidth" style="align-items: center">
        <w-span t=${el.emoji} fs=2em></w-span>
        <div class="flex column">
          <w-span t=${el.w} class="transition" fs=1.2em fw=500 c=#ffc107 .play=${play(el.s, 0, 500)}></w-span>
          <w-span t=${el.s} fs=0.7em c=grey></w-span>
        </div>
        <w-span t=${el.m}></w-span>
      </div>
      <!-- <div flex fullwidth> -->
        <!-- <w-span t=${el.m} style=""></w-span>
        <w-span t=${el.w} style="text-align:center" big w=500 c=#7371fb
                .op=${play(`2${el.w}.mp3`, 0, 900)}></w-span>
        <w-span t=${el.s} style="text-align:right"></w-span>
        <img -->
      <!-- </div> -->
    `
  })}
  </page-element>
  <div id=stamp style="position:absolute;bottom:0;right:0">@chikojap</div>
</canvas-element>
`